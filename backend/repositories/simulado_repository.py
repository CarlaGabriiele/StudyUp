from sqlmodel import Session, select
from models import Simulado, SimuladoQuestao

class SimuladoRepository:
    @staticmethod
    def buscar_por_id(session: Session, simulado_id: int):
        return session.get(Simulado, simulado_id)

    @staticmethod
    def listar(session: Session):
        return session.exec(select(Simulado)).all()

    @staticmethod
    def salvar(session: Session, simulado: Simulado):
        session.add(simulado)
        session.commit()
        session.refresh(simulado)
        return simulado

    @staticmethod
    def deletar(session: Session, simulado: Simulado):
        session.delete(simulado)
        session.commit()

    @staticmethod
    def buscar_relacao(session: Session, simulado_id: int, questao_id: int):
        return session.exec(
            select(SimuladoQuestao).where(
                SimuladoQuestao.simulado_id == simulado_id,
                SimuladoQuestao.questao_id == questao_id
            )
        ).first()

    @staticmethod
    def salvar_relacao(session: Session, relacao: SimuladoQuestao):
        session.add(relacao)
        session.commit()
        return relacao
