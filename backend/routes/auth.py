from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database import get_session
from models import Usuario
from schemas import RegisterData, EsqueciSenhaData, RedefinirSenhaData
from services.auth_service import AuthService

router = APIRouter(tags=["Autenticação"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = AuthService.decodificar_token(token)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Token inválido.")
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado.")
    return usuario

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterData, session: Session = Depends(get_session)):
    usuario_existente = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Este email já está cadastrado no StudyUp.")
    
    senha_criptografada = AuthService.criar_hash_senha(data.senha)
    novo_usuario = Usuario(nome=data.nome, email=data.email, senha=senha_criptografada)
    session.add(novo_usuario)
    session.commit()
    return {"message": "Conta do StudyUp criada com sucesso!"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    usuario = session.exec(select(Usuario).where(Usuario.email == form_data.username)).first()
    if usuario and AuthService.verificar_senha(form_data.password, usuario.senha):
        token = AuthService.criar_token(data={"sub": usuario.email})
        return {
            "message": f"Bem-vindo de volta, {usuario.nome}!",
            "access_token": token,
            "token_type": "bearer"
        }
    raise HTTPException(status_code=401, detail="Email ou senha incorretos.")

@router.get("/me")
def obter_perfil_usuario(current_user: Usuario = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nome": current_user.nome,
        "email": current_user.email
    }

@router.post("/esqueci-senha")
def esqueci_senha(data: EsqueciSenhaData, session: Session = Depends(get_session)):
    usuario = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
    if not usuario:
        return {"message": "Se o email estiver registado, receberá as instruções."}
    token_recuperacao = AuthService.criar_token(data={"sub": usuario.email, "tipo": "recuperacao"})
    return {
        "message": "Se o email estiver registado, receberá as instruções.",
        "token_teste": token_recuperacao 
    }

@router.post("/redefinir-senha")
def redefinir_senha(data: RedefinirSenhaData, session: Session = Depends(get_session)):
    payload = AuthService.decodificar_token(data.token)
    email: str = payload.get("sub")
    tipo: str = payload.get("tipo")
    if email is None or tipo != "recuperacao":
        raise HTTPException(status_code=400, detail="Token inválido ou expirado.")
        
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")
        
    usuario.senha = AuthService.criar_hash_senha(data.nova_senha)
    session.add(usuario)
    session.commit()
    return {"message": "A sua senha foi redefinida com sucesso!"}