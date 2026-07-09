from pydantic import BaseModel, EmailStr, Field

class RegisterData(BaseModel):
    nome: str = Field(..., min_length=3, description="O nome deve ter pelo menos 3 caracteres")
    email: EmailStr = Field(..., description="E-mail válido é obrigatório")
    senha: str = Field(..., min_length=8, description="A senha deve ter no mínimo 8 caracteres")

class LoginData(BaseModel):
    email: EmailStr
    senha: str

class EsqueciSenhaData(BaseModel):
    email: EmailStr

class RedefinirSenhaData(BaseModel):
    token: str
    nova_senha: str = Field(..., min_length=8)

class ResponderQuestaoData(BaseModel):
    questao_id: int
    alternativa_escolhida: str
    tempo_gasto: int