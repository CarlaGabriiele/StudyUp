from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import Session, select
from models import Usuario
from fastapi import HTTPException, status

SECRET_KEY = "chave-secreta-studyup-super-segura" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def criar_hash_senha(senha: str) -> str:
        return pwd_context.hash(senha)

    @staticmethod
    def verificar_senha(senha_pura: str, senha_hash: str) -> bool:
        return pwd_context.verify(senha_pura, senha_hash)

    @staticmethod
    def criar_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decodificar_token(token: str) -> dict:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Não foi possível validar as credenciais. Faça login novamente."
            )