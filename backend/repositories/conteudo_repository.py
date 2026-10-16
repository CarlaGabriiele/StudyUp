from typing import List, Optional
from sqlmodel import Session, select
from models import ConteudoTeorico

class ConteudoRepository:
    @staticmethod
    def buscar_por_id(session: Session, conteudo_id: int):
        return session.get(ConteudoTeorico, conteudo_id)

    @staticmethod
    def listar(session: Session, disciplina: Optional[str] = None):
        query = select(ConteudoTeorico)
        if disciplina:
            query = query.where(ConteudoTeorico.disciplina == disciplina)
        return session.exec(query).all()

    @staticmethod
    def salvar(session: Session, conteudo: ConteudoTeorico):
        session.add(conteudo)
        session.commit()
        session.refresh(conteudo)
        return conteudo

    @staticmethod
    def salvar_varios(session: Session, conteudos: List[ConteudoTeorico]):
        for conteudo in conteudos:
            session.add(conteudo)
        session.commit()
