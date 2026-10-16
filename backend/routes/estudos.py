from typing import Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import Usuario
from routes.auth import get_current_user
from services.estudo_service import EstudoService

router = APIRouter(prefix="/estudos", tags=["Gestão de Estudos"])

@router.get("/conteudos")
def listar_conteudos(
    disciplina: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return EstudoService.listar_conteudos(session, disciplina)

@router.patch("/conteudos/{conteudo_id}/concluir")
def marcar_conteudo_concluido(
    conteudo_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return EstudoService.marcar_conteudo_concluido(session, conteudo_id)

@router.get("/dashboard")
def obter_dashboard_estudos(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return EstudoService.obter_dashboard(session, current_user)

@router.get("/desempenho-detalhado")
def obter_desempenho_detalhado(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return EstudoService.obter_desempenho_detalhado(session, current_user)
