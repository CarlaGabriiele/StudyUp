from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import ConteudoTeorico, Usuario
from routes.auth import get_current_user

router = APIRouter(tags=["Conteúdos"])

@router.get("/conteudos/videoaulas")
def listar_videoaulas(
    session: Session = Depends(get_session), 
    current_user: Usuario = Depends(get_current_user)
):
    aulas = session.exec(select(ConteudoTeorico)).all()
    
    # Caso o banco esteja vazio, retorna aulas padrão para teste
    if not aulas:
        return [
            {
                "id": 1,
                "titulo": "Matemática: Equações do 2º Grau",
                "materia": "Matemática",
                "url_video": "https://youtu.be/O52z4JSNisI?si=XvHXTR-t3QksiDbs",
                "descricao": "Revisão prática de conceitos essenciais para o ENEM."
            },
            {
                "id": 2,
                "titulo": "História: Era Vargas",
                "materia": "Ciências Humanas",
                "url_video": "https://youtu.be/C6IUgc_arhc?si=CcmEbT80Qu_HI0VC",
                "descricao": "Principais pontos cobrados na prova de Ciências Humanas."
            },
            {
                "id": 3,
                "titulo": "Física: Ondas",
                "materia": "Ciências Natureza",
                "url_video": "https://youtu.be/4w3PcXQ6Wd0?si=wwXcl4wucYYjopoP",
                "descricao": "Tudo sobre ondas para o ENEM."
            }
        ]
        
    return aulas