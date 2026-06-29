from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import Usuario, Questao, Simulado
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

app = FastAPI(title="API StudyUp")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "chave-secreta-studyup-super-segura" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def criar_hash_senha(senha):
    return pwd_context.hash(senha)

def verificar_senha(senha_pura, senha_hash):
    return pwd_context.verify(senha_pura, senha_hash)

def criar_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if usuario is None:
        raise credentials_exception
        
    return usuario

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

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterData, session: Session = Depends(get_session)):
    try:
        usuario_existente = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
        if usuario_existente:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Este email já está cadastrado no StudyUp.")
        
        senha_criptografada = criar_hash_senha(data.senha)
        novo_usuario = Usuario(nome=data.nome, email=data.email, senha=senha_criptografada)
        
        session.add(novo_usuario)
        session.commit()
        return {"message": "Conta do StudyUp criada com sucesso!"}
    except HTTPException as http_e:
        raise http_e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.post("/login")
def login(data: LoginData, session: Session = Depends(get_session)):
    usuario = session.exec(select(Usuario).where(Usuario.email == data.email)).first()

    if usuario and verificar_senha(data.senha, usuario.senha):
        token = criar_token(data={"sub": usuario.email})
        return {
            "message": f"Bem-vindo de volta, {usuario.nome}!",
            "access_token": token
        }

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos.")


@app.post("/questoes", status_code=status.HTTP_201_CREATED)
def criar_questao(questao: Questao, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(questao)
    session.commit()
    session.refresh(questao)
    return questao

@app.get("/questoes")
def listar_questoes(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    return session.exec(select(Questao)).all()

@app.get("/questoes/{questao_id}")
def obter_questao(questao_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    questao = session.get(Questao, questao_id)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    return questao

@app.put("/questoes/{questao_id}")
def atualizar_questao(questao_id: int, questao_atualizada: Questao, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    db_questao = session.get(Questao, questao_id)
    if not db_questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    
    questao_data = questao_atualizada.dict(exclude_unset=True)
    for key, value in questao_data.items():
        if key != "id":
            setattr(db_questao, key, value)
            
    session.add(db_questao)
    session.commit()
    session.refresh(db_questao)
    return db_questao

@app.delete("/questoes/{questao_id}")
def deletar_questao(questao_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    questao = session.get(Questao, questao_id)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")
    session.delete(questao)
    session.commit()
    return {"message": "Questão deletada com sucesso!"}


@app.post("/simulados", status_code=status.HTTP_201_CREATED)
def criar_simulado(simulado: Simulado, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(simulado)
    session.commit()
    session.refresh(simulado)
    return simulado

@app.get("/simulados")
def listar_simulados(session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    return session.exec(select(Simulado)).all()

@app.get("/simulados/{simulado_id}")
def obter_simulado(simulado_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    return simulado

@app.put("/simulados/{simulado_id}")
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

@app.delete("/simulados/{simulado_id}")
def deletar_simulado(simulado_id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    simulado = session.get(Simulado, simulado_id)
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado.")
    session.delete(simulado)
    session.commit()
    return {"message": "Simulado deletado com sucesso!"}