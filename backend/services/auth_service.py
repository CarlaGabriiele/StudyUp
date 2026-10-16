import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import Session
from models import Usuario
from repositories.usuario_repository import UsuarioRepository
from fastapi import HTTPException, status

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("Defina a variável SECRET_KEY no arquivo .env (veja o .env.example).")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def criar_hash_senha(senha: str) -> str:
        return pwd_context.hash(senha)

    @staticmethod
    def verificar_senha(senha_pura: str, senha_hash: str) -> bool:
        return pwd_context.verify(senha_pura, senha_hash)

    @staticmethod
    def criar_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decodificar_token(token: str) -> dict:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Não foi possível validar as credenciais. Faça login novamente."
            )

    @staticmethod
    def obter_usuario_atual(session: Session, token: str):
        payload = AuthService.decodificar_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido.")
        usuario = UsuarioRepository.buscar_por_email(session, email)
        if usuario is None:
            raise HTTPException(status_code=401, detail="Usuário não encontrado.")
        return usuario

    @staticmethod
    def registrar(session: Session, data):
        usuario_existente = UsuarioRepository.buscar_por_email(session, data.email)
        if usuario_existente:
            raise HTTPException(status_code=400, detail="Este email já está cadastrado no StudyUp.")

        senha_criptografada = AuthService.criar_hash_senha(data.senha)
        novo_usuario = Usuario(nome=data.nome, email=data.email, senha=senha_criptografada)
        UsuarioRepository.salvar(session, novo_usuario)
        return {"message": "Conta do StudyUp criada com sucesso!"}

    @staticmethod
    def login(session: Session, email: str, senha: str):
        usuario = UsuarioRepository.buscar_por_email(session, email)
        if usuario and AuthService.verificar_senha(senha, usuario.senha):
            token = AuthService.criar_token(data={"sub": usuario.email})
            return {
                "message": f"Bem-vindo de volta, {usuario.nome}!",
                "access_token": token,
                "token_type": "bearer"
            }
        raise HTTPException(status_code=401, detail="Email ou senha incorretos.")

    @staticmethod
    def esqueci_senha(session: Session, data):
        usuario = UsuarioRepository.buscar_por_email(session, data.email)
        if not usuario:
            return {"message": "Se o email estiver registado, receberá as instruções."}
        token_recuperacao = AuthService.criar_token(data={"sub": usuario.email, "tipo": "recuperacao"})
        return {
            "message": "Se o email estiver registado, receberá as instruções.",
            "token_teste": token_recuperacao
        }

    @staticmethod
    def redefinir_senha(session: Session, data):
        payload = AuthService.decodificar_token(data.token)
        email: str = payload.get("sub")
        tipo: str = payload.get("tipo")
        if email is None or tipo != "recuperacao":
            raise HTTPException(status_code=400, detail="Token inválido ou expirado.")

        usuario = UsuarioRepository.buscar_por_email(session, email)
        if not usuario:
            raise HTTPException(status_code=404, detail="Utilizador não encontrado.")

        usuario.senha = AuthService.criar_hash_senha(data.nova_senha)
        UsuarioRepository.salvar(session, usuario)
        return {"message": "A sua senha foi redefinida com sucesso!"}
