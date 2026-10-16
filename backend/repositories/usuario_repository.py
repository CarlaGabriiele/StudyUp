from sqlmodel import Session, select
from models import Usuario

class UsuarioRepository:
    @staticmethod
    def buscar_por_email(session: Session, email: str):
        return session.exec(select(Usuario).where(Usuario.email == email)).first()

    @staticmethod
    def salvar(session: Session, usuario: Usuario):
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return usuario
