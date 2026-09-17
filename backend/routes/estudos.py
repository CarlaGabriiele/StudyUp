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

@router.get("/desempenho-detalhado")
def obter_desempenho_detalhado(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    registros = session.exec(
        select(RegistroDesempenho).where(RegistroDesempenho.estudante_id == current_user.id)
    ).all()

    total_questoes = len(registros)
    total_acertos = sum(1 for r in registros if r.resultado)
    total_erros = total_questoes - total_acertos
    taxa_acerto = round((total_acertos / total_questoes * 100), 2) if total_questoes > 0 else 0
    tempo_total_segundos = sum(r.tempo_gasto for r in registros)
    tempo_medio_segundos = round(tempo_total_segundos / total_questoes) if total_questoes > 0 else 0

    # Agrupamento por disciplina e por nível de dificuldade
    por_disciplina: dict = {}
    por_dificuldade: dict = {}

    for r in registros:
        if not r.questao:
            continue

        disciplina = r.questao.disciplina
        dificuldade = r.questao.nivel_dificuldade

        if disciplina not in por_disciplina:
            por_disciplina[disciplina] = {"total": 0, "acertos": 0}
        por_disciplina[disciplina]["total"] += 1
        if r.resultado:
            por_disciplina[disciplina]["acertos"] += 1

        if dificuldade not in por_dificuldade:
            por_dificuldade[dificuldade] = {"total": 0, "acertos": 0}
        por_dificuldade[dificuldade]["total"] += 1
        if r.resultado:
            por_dificuldade[dificuldade]["acertos"] += 1

    desempenho_por_disciplina = sorted(
        [
            {
                "disciplina": disciplina,
                "total_respondidas": dados["total"],
                "acertos": dados["acertos"],
                "erros": dados["total"] - dados["acertos"],
                "taxa_acerto_porcentagem": round((dados["acertos"] / dados["total"] * 100), 2)
                if dados["total"] > 0 else 0,
            }
            for disciplina, dados in por_disciplina.items()
        ],
        key=lambda item: item["total_respondidas"],
        reverse=True,
    )

    desempenho_por_dificuldade = [
        {
            "nivel": nivel,
            "total_respondidas": dados["total"],
            "acertos": dados["acertos"],
            "erros": dados["total"] - dados["acertos"],
            "taxa_acerto_porcentagem": round((dados["acertos"] / dados["total"] * 100), 2)
            if dados["total"] > 0 else 0,
        }
        for nivel, dados in por_dificuldade.items()
    ]

    # Simulados em que o estudante já registou respostas
    total_simulados_realizados = len({r.simulado_id for r in registros if r.simulado_id is not None})

    # Progresso nas aulas/conteúdos teóricos
    conteudos = session.exec(select(ConteudoTeorico)).all()
    total_aulas = len(conteudos)
    aulas_concluidas = sum(1 for c in conteudos if c.concluido)
    taxa_conclusao_aulas = round((aulas_concluidas / total_aulas * 100), 2) if total_aulas > 0 else 0

    return {
        "estudante": current_user.nome,
        "resumo_geral": {
            "total_respondidas": total_questoes,
            "total_acertos": total_acertos,
            "total_erros": total_erros,
            "taxa_acerto_porcentagem": taxa_acerto,
            "tempo_total_estudado_minutos": round(tempo_total_segundos / 60, 1),
            "tempo_medio_por_questao_segundos": tempo_medio_segundos,
            "total_simulados_realizados": total_simulados_realizados,
        },
        "desempenho_por_disciplina": desempenho_por_disciplina,
        "desempenho_por_dificuldade": desempenho_por_dificuldade,
        "aulas": {
            "total": total_aulas,
            "concluidas": aulas_concluidas,
            "taxa_conclusao_porcentagem": taxa_conclusao_aulas,
        },
    }