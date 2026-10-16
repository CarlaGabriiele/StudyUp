from sqlmodel import Session, select
from models import AlternativaEliminada

class AlternativaEliminadaRepository:
    @staticmethod
    def listar_por_estudante(session: Session, estudante_id: int):
        return session.exec(
            select(AlternativaEliminada).where(AlternativaEliminada.estudante_id == estudante_id)
        ).all()

    @staticmethod
    def buscar(session: Session, estudante_id: int, questao_id: int, letra: str):
        return session.exec(
            select(AlternativaEliminada).where(
                AlternativaEliminada.estudante_id == estudante_id,
                AlternativaEliminada.questao_id == questao_id,
                AlternativaEliminada.letra == letra
            )
        ).first()

    @staticmethod
    def salvar(session: Session, alternativa_eliminada: AlternativaEliminada):
        session.add(alternativa_eliminada)
        session.commit()
        session.refresh(alternativa_eliminada)
        return alternativa_eliminada

    @staticmethod
    def deletar(session: Session, alternativa_eliminada: AlternativaEliminada):
        session.delete(alternativa_eliminada)
        session.commit()
