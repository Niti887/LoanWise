from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PredictionBase(BaseModel):
    loan_amount: float
    annual_income: float
    credit_score: int
    employment_length: float
    debt_to_income_ratio: float
    home_ownership: str
    purpose: str
    interest_rate: float
    term: str

class PredictionCreate(PredictionBase):
    pass

class Prediction(PredictionBase):
    id: int
    user_id: int
    default_probability: float
    risk_classification: str
    created_at: datetime

    class Config:
        from_attributes = True 