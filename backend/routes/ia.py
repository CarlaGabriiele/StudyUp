from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Dict
from database import get_session
from models import RegistroDesempenho, ConteudoTeorico, Questao, Usuario
from routes.auth import get_current_user

router = APIRouter(prefix="/ia", tags=["Inteligência de Dados"])

@router.get("/relatorio-desempenho")
def relatorio_desempenho(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    registros = session.exec(
        select(RegistroDesempenho).where(RegistroDesempenho.estudante_id == current_user.id)
    ).all()
    
    total = len(registros)
    if total == 0:
        return {
            "total_questoes_respondidas": 0,
            "acertos": 0,
            "erros": 0,
            "taxa_acerto": 0,
            "dica_ia": "Você ainda não respondeu nenhuma questão. Comece a praticar!",
            "recomendacoes_videoaulas": []
        }

    acertos = sum(1 for r in registros if r.resultado)
    erros = total - acertos
    taxa_acerto = round((acertos / total) * 100, 2)

    erros_por_disciplina: Dict[str, int] = {}
    for r in registros:
        if not r.resultado and r.questao:
            disciplina = r.questao.disciplina
            erros_por_disciplina[disciplina] = erros_por_disciplina.get(disciplina, 0) + 1

    sugestoes_aulas = []
    dica_ia = "Seu desempenho está ótimo! Continue mantendo o ritmo de revisões."

    if erros_por_disciplina:
        pior_disciplina = max(erros_por_disciplina, key=erros_por_disciplina.get)
        
        conteudos = session.exec(
            select(ConteudoTeorico).where(ConteudoTeorico.disciplina == pior_disciplina)
        ).all()

        sugestoes_aulas = [
            {
                "id": c.id,
                "titulo": c.titulo,
                "url_video": c.url_video,
                "disciplina": c.disciplina
            }
            for c in conteudos
        ]

        dica_ia = (
            f"Notamos um índice alto de erros em **{pior_disciplina}** ({erros_por_disciplina[pior_disciplina]} erros). "
            f"Recomendamos revisar os vídeos sugeridos abaixo antes de fazer novos simulados!"
        )

    return {
        "total_questoes_respondidas": total,
        "acertos": acertos,
        "erros": erros,
        "taxa_acerto_porcentagem": taxa_acerto,
        "dica_ia": dica_ia,
        "recomendacoes_videoaulas": sugestoes_aulas
    }