from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import RegistroDesempenho, Usuario
from routes.auth import get_current_user

router = APIRouter(tags=["Inteligência de Dados"])

@router.get("/ia/relatorio-desempenho")
def relatorio_desempenho(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    registros = session.exec(select(RegistroDesempenho).where(RegistroDesempenho.estudante_id == current_user.id)).all()
    
    total = len(registros)
    acertos = sum(1 for r in registros if r.resultado)
    erros = total - acertos
    
    return {
        "total_questoes_respondidas": total,
        "acertos": acertos,
        "erros": erros,
        "dica_ia": "Em breve, o StudyUp vai te sugerir videoaulas com base nos seus erros!"
    }