from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Questao, RegistroDesempenho, Usuario
from schemas import ResponderQuestaoData
from routes.auth import get_current_user

router = APIRouter(tags=["Questões"])

@router.post("/questoes", status_code=status.HTTP_201_CREATED)
def criar_questao(questao: Questao, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(questao)
    session.commit()
    session.refresh(questao)
    return questao

@router.get("/questoes")
def listar_questoes(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    return session.exec(select(Questao)).all()

@router.get("/questoes/{questao_id}")
def obter_questao(questao_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    questao = session.get(Questao, questao_id)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    return questao

@router.put("/questoes/{questao_id}")
def atualizar_questao(questao_id: int, questao_atualizada: Questao, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    db_questao = session.get(Questao, questao_id)
    if not db_questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    
    questao_data = questao_atualizada.dict(exclude_unset=True)
    for key, value in questao_data.items():
        if key != "id":
            setattr(db_questao, key, value)
    session.add(db_questao)
    session.commit()
    session.refresh(db_questao)
    return db_questao

@router.delete("/questoes/{questao_id}")
def deletar_questao(questao_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    questao = session.get(Questao, questao_id)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    session.delete(questao)
    session.commit()
    return {"message": "Questão deletada com sucesso!"}

@router.post("/questoes/responder")
def responder_questao(data: ResponderQuestaoData, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    questao = session.get(Questao, data.questao_id)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    
    acertou = (data.alternativa_escolhida.upper() == questao.resposta_correta.upper())
    registro = RegistroDesempenho(
        estudante_id=current_user.id,
        questao_id=questao.id,
        resultado=acertou,
        tempo_gasto=data.tempo_gasto
    )
    session.add(registro)
    session.commit()
    return {
        "acertou": acertou,
        "gabarito": questao.resposta_correta,
        "mensagem": "Parabéns, você acertou!" if acertou else "Não foi dessa vez, tente dar uma revisada no assunto!"
    }