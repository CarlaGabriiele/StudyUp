from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import Usuario
from routes.auth import get_current_user
from services.conteudo_service import ConteudoService

router = APIRouter(tags=["Conteúdos"])

@router.get("/conteudos/videoaulas")
def listar_videoaulas(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return ConteudoService.listar_videoaulas(session)
