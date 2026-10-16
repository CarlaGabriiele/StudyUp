from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from models import Simulado, Usuario
from routes.auth import get_current_user
from services.simulado_service import SimuladoService
from pydantic import BaseModel
from typing import Dict

router = APIRouter(prefix="/simulados", tags=["Simulados"])

@router.post("/{simulado_id}/questoes/{questao_id}", status_code=status.HTTP_201_CREATED)
def adicionar_questao_ao_simulado(
    simulado_id: int,
    questao_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.adicionar_questao(session, simulado_id, questao_id)


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_simulado(
    simulado: Simulado, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.criar(session, simulado)

@router.get("")
def listar_simulados(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.listar(session)

@router.get("/{simulado_id}")
def obter_simulado(
    simulado_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.obter(session, simulado_id)

@router.put("/{simulado_id}")
def atualizar_simulado(
    simulado_id: int, 
    simulado_atualizado: Simulado, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.atualizar(session, simulado_id, simulado_atualizado)

@router.delete("/{simulado_id}")
def deletar_simulado(
    simulado_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.deletar(session, simulado_id)

   
class SubmeterSimuladoData(BaseModel):
    respostas: Dict[int, str] 
    tempo_total_segundos: int

@router.post("/{simulado_id}/submeter")
def submeter_simulado(
    simulado_id: int,
    data: SubmeterSimuladoData,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    return SimuladoService.submeter(session, simulado_id, data, current_user)
