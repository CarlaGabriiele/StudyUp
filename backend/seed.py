from sqlmodel import Session
from database import engine
from models import Questao

questoes_mock = [
    {
        "enunciado": "A persistência da memória é uma obra de qual artista?",
        "disciplina": "Artes",
        "alternativas": "A) Picasso, B) Dalí, C) Monet",
        "resposta_correta": "Dalí",
        "nivel_dificuldade": "facil"
    },
    {
        "enunciado": "Qual a fórmula química da água?",
        "disciplina": "Química",
        "alternativas": "A) H2O, B) CO2, C) O2",
        "resposta_correta": "H2O",
        "nivel_dificuldade": "facil"
    },
    {
        "enunciado": "Quem escreveu 'Dom Casmurro'?",
        "disciplina": "Literatura",
        "alternativas": "A) Alencar, B) Machado de Assis, C) Jorge Amado",
        "resposta_correta": "Machado de Assis",
        "nivel_dificuldade": "medio"
    }
]

def seed_questoes():
    with Session(engine) as session:
        if session.exec(session.query(Questao)).first():
            print("⚠️ O banco já possui questões cadastradas.")
            return

        for q_data in questoes_mock:
            nova_questao = Questao(**q_data)
            session.add(nova_questao)
        session.commit()
        print("✅ Questões do ENEM cadastradas com sucesso no banco de dados!")

if __name__ == "__main__":
    seed_questoes()