from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import Usuario, Questao, Simulado
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

app = FastAPI(title="API StudyUp")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações de Segurança do JWT
SECRET_KEY = "chave-secreta-studyup-super-segura" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criar_hash_senha(senha):
    return pwd_context.hash(senha)

def verificar_senha(senha_pura, senha_hash):
    return pwd_context.verify(senha_pura, senha_hash)

def criar_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

class RegisterData(BaseModel):
    nome: str
    email: str
    senha: str

class LoginData(BaseModel):
    email: str
    senha: str

@app.post("/register")
def register(data: RegisterData, session: Session = Depends(get_session)):
    try:
        usuario_existente = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
        if usuario_existente:
            return {"error": "Este email já está cadastrado no StudyUp."}
        
        # Criptografando a senha antes de salvar no banco
        senha_criptografada = criar_hash_senha(data.senha)
        novo_usuario = Usuario(nome=data.nome, email=data.email, senha=senha_criptografada)
        
        session.add(novo_usuario)
        session.commit()
        return {"message": "Conta do StudyUp criada com sucesso!"}
    except Exception as e:
        return {"error": f"Erro interno: {str(e)}"}

@app.post("/login")
def login(data: LoginData, session: Session = Depends(get_session)):
    # Busca o usuário apenas pelo email
    usuario = session.exec(select(Usuario).where(Usuario.email == data.email)).first()

    # Verifica se o usuário existe e se a senha digitada bate com a criptografada
    if usuario and verificar_senha(data.senha, usuario.senha):
        token = criar_token(data={"sub": usuario.email})
        return {
            "message": f"Bem-vindo de volta, {usuario.nome}!",
            "access_token": token
        }

    return {"error": "Email ou senha incorretos."}

# ==========================================
# NOVAS FUNCIONALIDADES DAS SPRINTS 4 E 5
# ==========================================

# 1. Função que protege rotas e pega o usuário logado via Token
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

# 2. Endpoint de Perfil do Usuário
@app.get("/me", response_model=Usuario)
def read_users_me(current_user: Usuario = Depends(get_current_user)):
    return current_user

# 3. CRUD de Questões
@app.post("/questoes/")
def criar_questao(questao: Questao, session: Session = Depends(get_session)):
    session.add(questao)
    session.commit()
    session.refresh(questao)
    return questao

@app.get("/questoes/")
def listar_questoes(session: Session = Depends(get_session)):
    return session.exec(select(Questao)).all()

# 4. CRUD de Simulados
@app.post("/simulados/")
def criar_simulado(simulado: Simulado, session: Session = Depends(get_session)):
    session.add(simulado)
    session.commit()
    session.refresh(simulado)
    return simulado

@app.get("/simulados/")
def listar_simulados(session: Session = Depends(get_session)):
    return session.exec(select(Simulado)).all()