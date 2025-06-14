from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import joblib
import numpy as np
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User, Prediction
from app.schemas.schemas import PredictionCreate, Prediction as PredictionSchema
from app.api.routes.auth import oauth2_scheme
from app.core.security import verify_password

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def classify_risk(probability: float) -> str:
    if probability < 0.2:
        return "Low"
    elif probability < 0.5:
        return "Medium"
    else:
        return "High"

@router.post("/predict", response_model=PredictionSchema)
def create_prediction(
    prediction: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Load the model
    model = joblib.load(settings.MODEL_PATH)
    
    # Prepare features for prediction
    features = np.array([[
        prediction.loan_amount,
        prediction.annual_income,
        prediction.credit_score,
        prediction.employment_length,
        prediction.debt_to_income_ratio
    ]])
    
    # Make prediction
    default_probability = float(model.predict_proba(features)[0][1])
    risk_classification = classify_risk(default_probability)
    
    # Create prediction record
    db_prediction = Prediction(
        user_id=current_user.id,
        loan_amount=prediction.loan_amount,
        annual_income=prediction.annual_income,
        credit_score=prediction.credit_score,
        employment_length=prediction.employment_length,
        debt_to_income_ratio=prediction.debt_to_income_ratio,
        home_ownership=prediction.home_ownership,
        purpose=prediction.purpose,
        interest_rate=prediction.interest_rate,
        term=prediction.term,
        default_probability=default_probability,
        risk_classification=risk_classification
    )
    
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

@router.get("/history", response_model=List[PredictionSchema])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    predictions = db.query(Prediction).filter(Prediction.user_id == current_user.id).all()
    return predictions 