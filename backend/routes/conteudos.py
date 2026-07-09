from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import ConteudoTeorico, Usuario
from routes.auth import get_current_user

router = APIRouter(tags=["Conteúdos"])

@router.get("/conteudos/videoaulas")
def listar_videoaulas(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    return session.exec(select(ConteudoTeorico)).all()