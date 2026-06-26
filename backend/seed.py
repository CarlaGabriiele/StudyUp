from sqlmodel import Session
from database import engine
from models import Questao

# Dados adaptados aos atributos exatos que existem na sua classe Questao do models.py
questoes_mock = [
    {
        "enunciado": "A persistência da memória é uma obra de qual artista?",
        "materia": "Artes",
        "alternativa_correta": "Salvador Dalí",
        "ano_enem": 2012
    },
    {
        "enunciado": "Qual a fórmula química da água?",
        "materia": "Química",
        "alternativa_correta": "H2O",
        "ano_enem": 2015
    },
    {
        "enunciado": "Quem escreveu 'Dom Casmurro'?",
        "materia": "Literatura",
        "alternativa_correta": "Machado de Assis",
        "ano_enem": 2018
    }
]

def seed_questoes():
    with Session(engine) as session:
        for q_data in questoes_mock:
            nova_questao = Questao(**q_data)
            session.add(nova_questao)
        session.commit()
        print("✅ Questões do ENEM cadastradas com sucesso no banco de dados!")

if __name__ == "__main__":
    seed_questoes()