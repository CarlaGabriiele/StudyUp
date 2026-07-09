from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class SimuladoQuestao(SQLModel, table=True):
    simulado_id: Optional[int] = Field(default=None, foreign_key="simulado.id", primary_key=True)
    questao_id: Optional[int] = Field(default=None, foreign_key="questao.id", primary_key=True)

class RegistroDesempenho(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    estudante_id: int = Field(foreign_key="usuario.id")
    questao_id: int = Field(foreign_key="questao.id")
    resultado: bool
    tempo_gasto: int

    estudante: "Usuario" = Relationship(back_populates="registros_desempenho")
    questao: "Questao" = Relationship(back_populates="registros_desempenho")

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(unique=True, index=True)
    senha: str
    
    registros_desempenho: List[RegistroDesempenho] = Relationship(back_populates="estudante")

class Questao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    enunciado: str
    alternativas: str
    resposta_correta: str
    nivel_dificuldade: str
    disciplina: str
    
    simulados: List["Simulado"] = Relationship(back_populates="questoes", link_model=SimuladoQuestao)
    registros_desempenho: List[RegistroDesempenho] = Relationship(back_populates="questao")

class Simulado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    descricao: Optional[str] = None
    
    questoes: List[Questao] = Relationship(back_populates="simulados", link_model=SimuladoQuestao)

class ConteudoTeorico(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    url_video: str
    disciplina: str