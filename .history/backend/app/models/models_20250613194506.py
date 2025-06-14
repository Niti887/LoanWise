from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    predictions = relationship("Prediction", back_populates="user")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    loan_amount = Column(Float)
    annual_income = Column(Float)
    credit_score = Column(Integer)
    employment_length = Column(Float)
    debt_to_income_ratio = Column(Float)
    default_probability = Column(Float)
    risk_classification = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional features
    home_ownership = Column(String)
    purpose = Column(String)
    interest_rate = Column(Float)
    term = Column(String)
    
    user = relationship("User", back_populates="predictions") 