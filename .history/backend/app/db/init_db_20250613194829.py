from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.base_class import Base
from app.db.session import engine
from app.models.models import User
from app.core.security import get_password_hash

def init_db() -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create initial admin user
    db = Session(engine)
    admin = db.query(User).filter(User.email == "admin@loanwise.com").first()
    if not admin:
        admin = User(
            email="admin@loanwise.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_superuser=True
        )
        db.add(admin)
        db.commit()
    db.close()

if __name__ == "__main__":
    init_db() 