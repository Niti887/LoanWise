from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import User as UserSchema
from app.api.routes.auth import oauth2_scheme
from app.api.routes.predictions import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user(
    user_update: UserSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.full_name = user_update.full_name
    db.commit()
    db.refresh(current_user)
    return current_user 