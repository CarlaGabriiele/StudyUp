from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import ConteudoTeorico, RegistroDesempenho, Usuario
from routes.auth import get_current_user

router = APIRouter(prefix="/estudos", tags=["Gestão de Estudos"])

@router.get("/conteudos")
def listar_conteudos(
    disciplina: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    query = select(ConteudoTeorico)
    if disciplina:
        query = query.where(ConteudoTeorico.disciplina == disciplina)
    return session.exec(query).all()

@router.patch("/conteudos/{conteudo_id}/concluir")
def marcar_conteudo_concluido(
    conteudo_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    conteudo = session.get(ConteudoTeorico, conteudo_id)
    if not conteudo:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado.")
    
    conteudo.concluido = True
    session.add(conteudo)
    session.commit()
    session.refresh(conteudo)
    return {"message": "Conteúdo marcado como concluído!", "conteudo": conteudo}

@router.get("/dashboard")
def obter_dashboard_estudos(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    registros = session.exec(
        select(RegistroDesempenho).where(RegistroDesempenho.estudante_id == current_user.id)
    ).all()

    total_questoes = len(registros)
    total_acertos = sum(1 for r in registros if r.resultado)
    taxa_acerto = (total_acertos / total_questoes * 100) if total_questoes > 0 else 0
    tempo_total_questoes_seg = sum(r.tempo_gasto for r in registros)

    return {
        "estudante": current_user.nome,
        "resumo_questoes": {
            "total_respondidas": total_questoes,
            "total_acertos": total_acertos,
            "taxa_acerto_porcentagem": round(taxa_acerto, 2),
            "tempo_total_em_questoes_minutos": round(tempo_total_questoes_seg / 60, 1)
        }
    }