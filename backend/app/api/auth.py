from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import Token, LoginRequest, UserRegister
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(request: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        # If user already exists, login directly
        if verify_password(request.password, existing.hashed_password):
            access_token = create_access_token(data={"sub": existing.email, "role": existing.role})
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user_email": existing.email,
                "user_name": existing.full_name
            }
        else:
            raise HTTPException(status_code=400, detail="Account with this email already exists")

    new_user = User(
        email=request.email,
        hashed_password=get_password_hash(request.password),
        full_name=request.full_name,
        role=request.role or "doctor"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_email": new_user.email,
        "user_name": new_user.full_name
    }

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Create default doctor account if not exists for research demo
        if request.email == "doctor@hospital.org" and request.password == "doctor123":
            user = User(
                email="doctor@hospital.org",
                hashed_password=get_password_hash("doctor123"),
                full_name="Dr. Mohammed Izhan, MD",
                role="doctor"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_email": user.email,
        "user_name": user.full_name
    }
