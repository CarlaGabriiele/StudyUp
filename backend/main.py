from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import Questao, Simulado
from typing import List

app = FastAPI(
    title="StudyUp API",
    description="Backend para a plataforma de estudos focada no ENEM",
    version="1.0.0"
)

# Evento que roda ao iniciar o servidor para criar o banco de dados
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vindo à API do StudyUp! Documentação em /docs"}

@app.post("/questoes/", response_model=Questao, status_code=status.HTTP_201_CREATED)
def criar_questao(questao: Questao, session: Session = Depends(get_session)):
    session.add(questao)
    session.commit()
    session.refresh(questao)
    return questao

@app.get("/questoes/", response_model=List[Questao])
def listar_questoes(session: Session = Depends(get_session)):
    questoes = session.exec(select(Questao)).all()
    return questoes

@app.put("/simulados/{simulado_id}", response_model=Simulado)
def atualizar_simulado(simulado_id: int, simulado_atualizado: Simulado, session: Session = Depends(get_session)):
    db_simulado = session.get(Simulado, simulado_id)
    if not db_simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado")
    
    simulado_data = simulado_atualizado.dict(exclude_unset=True)
    for key, value in simulado_data.items():
        setattr(db_simulado, key, value)
        
    session.add(db_simulado)
    session.commit()
    session.refresh(db_simulado)
    return db_simulado

@app.delete("/simulados/{simulado_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_simulado(simulado_id: int, session: Session = Depends(get_session)):
    db_simulado = session.get(Simulado, simulado_id)
    if not db_simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado")
    
    session.delete(db_simulado)
    session.commit()
    return None