from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="StudyUp API")

class Questao(BaseModel):
    id: int
    disciplina: str
    dificuldade: str

@app.get("/")
def home():
    return {"message": "Bem-vindo ao StudyUp - Democratizando a Aprovação!"}

@app.get("/questoes", response_model=List[Questao])
def get_questoes():
    return [
        {"id": 1, "disciplina": "Matemática", "dificuldade": "Média"},
        {"id": 2, "disciplina": "História", "dificuldade": "Fácil"}
    ]
