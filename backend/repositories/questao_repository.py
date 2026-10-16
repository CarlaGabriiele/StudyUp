from sqlmodel import Session, select
from models import Questao

class QuestaoRepository:
    @staticmethod
    def buscar_por_id(session: Session, questao_id: int):
        return session.get(Questao, questao_id)

    @staticmethod
    def listar(session: Session):
        return session.exec(select(Questao)).all()

    @staticmethod
    def salvar(session: Session, questao: Questao):
        session.add(questao)
        session.commit()
        session.refresh(questao)
        return questao

    @staticmethod
    def deletar(session: Session, questao: Questao):
        session.delete(questao)
        session.commit()
