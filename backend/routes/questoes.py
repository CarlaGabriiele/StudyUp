from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from models import Questao, Usuario
from schemas import ResponderQuestaoData
from routes.auth import get_current_user
from services.questao_service import QuestaoService

router = APIRouter(prefix="/questoes", tags=["Questões"])


@router.post("/responder", status_code=status.HTTP_201_CREATED)
def responder_questao(
    data: ResponderQuestaoData, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.responder(session, data, current_user)


@router.get("/alternativas-eliminadas")
def listar_alternativas_eliminadas(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.listar_alternativas_eliminadas(session, current_user)

@router.post("/{questao_id}/alternativas-eliminadas/{letra}", status_code=status.HTTP_201_CREATED)
def eliminar_alternativa(
    questao_id: int, 
    letra: str, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.eliminar_alternativa(session, questao_id, letra, current_user)

@router.delete("/{questao_id}/alternativas-eliminadas/{letra}")
def restaurar_alternativa(
    questao_id: int, 
    letra: str, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.restaurar_alternativa(session, questao_id, letra, current_user)


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_questao(
    questao: Questao, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.criar(session, questao)

@router.get("")
def listar_questoes(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.listar(session)

@router.get("/{questao_id}")
def obter_questao(
    questao_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.obter(session, questao_id)

@router.put("/{questao_id}")
def atualizar_questao(
    questao_id: int, 
    questao_atualizada: Questao, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.atualizar(session, questao_id, questao_atualizada)

@router.delete("/{questao_id}")
def deletar_questao(
    questao_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return QuestaoService.deletar(session, questao_id)
