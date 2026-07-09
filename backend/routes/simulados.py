from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Simulado, Usuario
from routes.auth import get_current_user

router = APIRouter(tags=["Simulados"])

@router.post("/simulados", status_code=status.HTTP_201_CREATED)
def criar_simulado(simulado: Simulado, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(simulado)
    session.commit()
    session.refresh(simulado)
    return simulado

@router.get("/simulados")
def listar_simulados(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    return session.exec(select(Simulado)).all()

@router.get("/simulados/{simulado_id}")
def obter_simulado(simulado_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    return simulado

@router.put("/simulados/{simulado_id}")
def atualizar_simulado(simulado_id: int, simulado_atualizado: Simulado, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    db_simulado = session.get(Simulado, simulado_id)
    if not db_simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    
    simulado_data = simulado_atualizado.dict(exclude_unset=True)
    for key, value in simulado_data.items():
        if key != "id":
            setattr(db_simulado, key, value)
    session.add(db_simulado)
    session.commit()
    session.refresh(db_simulado)
    return db_simulado

@router.delete("/simulados/{simulado_id}")
def deletar_simulado(simulado_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    session.delete(simulado)
    session.commit()
    return {"message": "Simulado deletado com sucesso!"}