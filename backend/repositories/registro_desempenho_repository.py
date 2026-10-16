from typing import List
from sqlmodel import Session, select
from models import RegistroDesempenho

class RegistroDesempenhoRepository:
    @staticmethod
    def listar_por_estudante(session: Session, estudante_id: int):
        return session.exec(
            select(RegistroDesempenho).where(RegistroDesempenho.estudante_id == estudante_id)
        ).all()

    @staticmethod
    def salvar(session: Session, registro: RegistroDesempenho):
        session.add(registro)
        session.commit()
        return registro

    @staticmethod
    def salvar_varios(session: Session, registros: List[RegistroDesempenho]):
        for registro in registros:
            session.add(registro)
        session.commit()
