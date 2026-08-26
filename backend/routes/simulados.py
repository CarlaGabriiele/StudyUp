from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Simulado, Questao, SimuladoQuestao, Usuario
from routes.auth import get_current_user
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
    simulado = session.get(Simulado, simulado_id)
    questao = session.get(Questao, questao_id)
    
    if not simulado or not questao:
        raise HTTPException(status_code=404, detail="Simulado ou Questão não encontrada.")

    relacao_existente = session.exec(
        select(SimuladoQuestao).where(
            SimuladoQuestao.simulado_id == simulado_id,
            SimuladoQuestao.questao_id == questao_id
        )
    ).first()

    if relacao_existente:
        raise HTTPException(status_code=400, detail="Esta questão já pertence a este simulado.")

    nova_relacao = SimuladoQuestao(simulado_id=simulado_id, questao_id=questao_id)
    session.add(nova_relacao)
    session.commit()
    
    return {"message": "Questão associada ao simulado com sucesso!"}


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_simulado(
    simulado: Simulado, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    session.add(simulado)
    session.commit()
    session.refresh(simulado)
    return simulado

@router.get("")
def listar_simulados(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    return session.exec(select(Simulado)).all()

@router.get("/{simulado_id}")
def obter_simulado(
    simulado_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")

    return {
        "id": simulado.id,
        "titulo": simulado.titulo,
        "descricao": simulado.descricao,
        "questoes": simulado.questoes
    }

@router.put("/{simulado_id}")
def atualizar_simulado(
    simulado_id: int, 
    simulado_atualizado: Simulado, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    db_simulado = session.get(Simulado, simulado_id)
    if not db_simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    
    simulado_data = simulado_atualizado.model_dump(exclude_unset=True)
    for key, value in simulado_data.items():
        if key != "id":
            setattr(db_simulado, key, value)
            
    session.add(db_simulado)
    session.commit()
    session.refresh(db_simulado)
    return db_simulado

@router.delete("/{simulado_id}")
def deletar_simulado(
    simulado_id: int, 
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
        
    session.delete(simulado)
    session.commit()
    return {"message": "Simulado deletado com sucesso!"}

   
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
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")

    if not simulado.questoes:
        raise HTTPException(status_code=400, detail="Este simulado não possui questões cadastrais.")

    total_questoes = len(simulado.questoes)
    acertos = 0
    detalhes_resposta = []

    tempo_medio_por_questao = int(data.tempo_total_segundos / total_questoes) if total_questoes > 0 else 0

    for questao in simulado.questoes:
        resposta_aluno = data.respostas.get(questao.id, "").strip().upper()
        acertou = (resposta_aluno == questao.resposta_correta.strip().upper())

        if acertou:
            acertos += 1

        registro = RegistroDesempenho(
            estudante_id=current_user.id,
            questao_id=questao.id,
            simulado_id=simulado.id,
            alternativa_escolhida=resposta_aluno,
            resultado=acertou,
            tempo_gasto=tempo_medio_por_questao
        )
        session.add(registro)

        detalhes_resposta.append({
            "questao_id": questao.id,
            "resposta_aluno": resposta_aluno,
            "gabarito": questao.resposta_correta,
            "correto": acertou
        })

    session.commit()

    porcentagem_acerto = round((acertos / total_questoes) * 100, 2)

    return {
        "simulado_id": simulado_id,
        "total_questoes": total_questoes,
        "acertos": acertos,
        "erros": total_questoes - acertos,
        "nota_porcentagem": porcentagem_acerto,
        "tempo_total_segundos": data.tempo_total_segundos,
        "detalhes": detalhes_resposta
    }