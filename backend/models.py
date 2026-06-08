from typing import Optional
from sqlmodel import Field, SQLModel

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(unique=True, index=True)
    senha: str # Vamos manter simples por agora, sem criptografia complexa

class Questao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    enunciado: str
    materia: str  
    alternativa_correta: str 
    ano_enem: int

class Simulado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str 
    quantidade_questoes: int
    ativo: bool = True