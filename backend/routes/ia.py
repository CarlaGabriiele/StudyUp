from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import Usuario
from routes.auth import get_current_user
from services.ia_service import IAService

router = APIRouter(prefix="/ia", tags=["Inteligência de Dados"])

@router.get("/relatorio-desempenho")
def relatorio_desempenho(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return IAService.relatorio_desempenho(session, current_user)
