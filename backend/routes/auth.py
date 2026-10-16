from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
from database import get_session
from models import Usuario
from schemas import RegisterData, EsqueciSenhaData, RedefinirSenhaData
from services.auth_service import AuthService

router = APIRouter(tags=["Autenticação"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    return AuthService.obter_usuario_atual(session, token)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterData, session: Session = Depends(get_session)):
    return AuthService.registrar(session, data)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    return AuthService.login(session, form_data.username, form_data.password)

@router.get("/me")
def obter_perfil_usuario(current_user: Usuario = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nome": current_user.nome,
        "email": current_user.email
    }

@router.post("/esqueci-senha")
def esqueci_senha(data: EsqueciSenhaData, session: Session = Depends(get_session)):
    return AuthService.esqueci_senha(session, data)

@router.post("/redefinir-senha")
def redefinir_senha(data: RedefinirSenhaData, session: Session = Depends(get_session)):
    return AuthService.redefinir_senha(session, data)
