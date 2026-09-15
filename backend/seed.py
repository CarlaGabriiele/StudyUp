from sqlmodel import Session, select
from database import engine
from models import Questao, Simulado, SimuladoQuestao, ConteudoTeorico

questoes_mock = [
    # ---------------- MATEMÁTICA ----------------
    {
        "enunciado": "Um terreno retangular tem 20 metros de comprimento por 15 metros de largura. Qual é a área desse terreno, em metros quadrados?",
        "disciplina": "Matemática",
        "alternativas": "A) 35 m², B) 150 m², C) 300 m², D) 600 m², E) 900 m²",
        "resposta_correta": "300 m²",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "Em uma promoção, um produto que custava R$ 80,00 teve desconto de 25%. Qual é o novo preço do produto?",
        "disciplina": "Matemática",
        "alternativas": "A) R$ 20,00, B) R$ 55,00, C) R$ 60,00, D) R$ 65,00, E) R$ 75,00",
        "resposta_correta": "R$ 60,00",
        "nivel_dificuldade": "medio",
    },
    {
        "enunciado": "Se uma torneira enche um tanque em 6 horas e outra torneira enche o mesmo tanque em 3 horas, quanto tempo as duas torneiras juntas levam para encher o tanque?",
        "disciplina": "Matemática",
        "alternativas": "A) 1 hora, B) 2 horas, C) 3 horas, D) 4 horas, E) 4,5 horas",
        "resposta_correta": "2 horas",
        "nivel_dificuldade": "dificil",
    },
    # ---------------- FÍSICA ----------------
    {
        "enunciado": "Qual é a unidade de medida da força no Sistema Internacional de Unidades?",
        "disciplina": "Física",
        "alternativas": "A) Joule, B) Watt, C) Newton, D) Pascal, E) Ampère",
        "resposta_correta": "Newton",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "Um carro percorre 180 km em 3 horas com velocidade constante. Qual é a velocidade média desse carro?",
        "disciplina": "Física",
        "alternativas": "A) 30 km/h, B) 45 km/h, C) 60 km/h, D) 90 km/h, E) 120 km/h",
        "resposta_correta": "60 km/h",
        "nivel_dificuldade": "medio",
    },
    {
        "enunciado": "Qual princípio físico explica por que um navio de aço, muito mais denso que a água, consegue flutuar?",
        "disciplina": "Física",
        "alternativas": "A) Lei da inércia, B) Princípio de Arquimedes, C) Lei de Ohm, D) Princípio de Pascal, E) Terceira lei de Newton",
        "resposta_correta": "Princípio de Arquimedes",
        "nivel_dificuldade": "medio",
    },
    # ---------------- QUÍMICA ----------------
    {
        "enunciado": "Qual é a fórmula química da água?",
        "disciplina": "Química",
        "alternativas": "A) H2O, B) CO2, C) O2, D) H2O2, E) NaCl",
        "resposta_correta": "H2O",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "O processo de separação de misturas homogêneas por diferença de ponto de ebulição é chamado de:",
        "disciplina": "Química",
        "alternativas": "A) Decantação, B) Filtração, C) Destilação, D) Centrifugação, E) Cristalização",
        "resposta_correta": "Destilação",
        "nivel_dificuldade": "medio",
    },
    {
        "enunciado": "Qual é o pH aproximado de uma solução considerada neutra, como a água pura?",
        "disciplina": "Química",
        "alternativas": "A) 0, B) 3, C) 7, D) 10, E) 14",
        "resposta_correta": "7",
        "nivel_dificuldade": "facil",
    },
    # ---------------- BIOLOGIA ----------------
    {
        "enunciado": "Qual organela celular é responsável pela produção de energia (ATP) na célula, sendo chamada de 'usina energética'?",
        "disciplina": "Biologia",
        "alternativas": "A) Ribossomo, B) Mitocôndria, C) Complexo de Golgi, D) Lisossomo, E) Núcleo",
        "resposta_correta": "Mitocôndria",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "No processo de fotossíntese, as plantas utilizam gás carbônico e água, na presença de luz, para produzir glicose e liberar qual gás?",
        "disciplina": "Biologia",
        "alternativas": "A) Nitrogênio, B) Hidrogênio, C) Gás carbônico, D) Oxigênio, E) Metano",
        "resposta_correta": "Oxigênio",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "Qual é o nome do processo de divisão celular que origina os gametas (células sexuais), reduzindo o número de cromossomos à metade?",
        "disciplina": "Biologia",
        "alternativas": "A) Mitose, B) Meiose, C) Fecundação, D) Mutação, E) Cariotipagem",
        "resposta_correta": "Meiose",
        "nivel_dificuldade": "medio",
    },
    # ---------------- HISTÓRIA ----------------
    {
        "enunciado": "Qual movimento político e social, iniciado em 1789, marcou o fim do Antigo Regime e a ascensão da burguesia na França?",
        "disciplina": "História",
        "alternativas": "A) Revolução Industrial, B) Revolução Francesa, C) Revolução Russa, D) Revolução Gloriosa, E) Independência dos EUA",
        "resposta_correta": "Revolução Francesa",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "O processo de transferência da capital do Brasil, do Rio de Janeiro para Brasília, ocorreu durante o governo de qual presidente?",
        "disciplina": "História",
        "alternativas": "A) Getúlio Vargas, B) Juscelino Kubitschek, C) João Goulart, D) Jânio Quadros, E) Café Filho",
        "resposta_correta": "Juscelino Kubitschek",
        "nivel_dificuldade": "medio",
    },
    {
        "enunciado": "A Lei Áurea, que aboliu formalmente a escravidão no Brasil, foi assinada em que ano?",
        "disciplina": "História",
        "alternativas": "A) 1822, B) 1850, C) 1871, D) 1888, E) 1891",
        "resposta_correta": "1888",
        "nivel_dificuldade": "medio",
    },
    # ---------------- GEOGRAFIA ----------------
    {
        "enunciado": "Qual é o maior bioma brasileiro em extensão territorial?",
        "disciplina": "Geografia",
        "alternativas": "A) Cerrado, B) Caatinga, C) Amazônia, D) Mata Atlântica, E) Pantanal",
        "resposta_correta": "Amazônia",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "O fenômeno climático caracterizado pelo aquecimento anormal das águas do Oceano Pacífico, que afeta o clima global, é conhecido como:",
        "disciplina": "Geografia",
        "alternativas": "A) La Niña, B) El Niño, C) Efeito Coriolis, D) Correntes de Humboldt, E) Ilha de calor",
        "resposta_correta": "El Niño",
        "nivel_dificuldade": "medio",
    },
    {
        "enunciado": "Como é chamado o processo de crescimento desordenado das cidades, geralmente associado à falta de infraestrutura e ocupação irregular do solo?",
        "disciplina": "Geografia",
        "alternativas": "A) Êxodo rural, B) Inchaço urbano, C) Conurbação, D) Segregação espacial, E) Gentrificação",
        "resposta_correta": "Inchaço urbano",
        "nivel_dificuldade": "medio",
    },
    # ---------------- LITERATURA ----------------
    {
        "enunciado": "Quem é o autor da obra 'Dom Casmurro', um dos maiores clássicos da literatura brasileira?",
        "disciplina": "Literatura",
        "alternativas": "A) José de Alencar, B) Machado de Assis, C) Jorge Amado, D) Graciliano Ramos, E) Lima Barreto",
        "resposta_correta": "Machado de Assis",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "O Modernismo brasileiro teve seu marco inicial oficial em qual evento cultural, realizado em 1922?",
        "disciplina": "Literatura",
        "alternativas": "A) Semana de Arte Moderna, B) Semana Nacional da Cultura, C) Bienal de São Paulo, D) Congresso Abolicionista, E) Feira do Livro",
        "resposta_correta": "Semana de Arte Moderna",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "Qual figura de linguagem consiste em atribuir características humanas a seres inanimados ou animais?",
        "disciplina": "Literatura",
        "alternativas": "A) Metáfora, B) Hipérbole, C) Prosopopeia, D) Antítese, E) Eufemismo",
        "resposta_correta": "Prosopopeia",
        "nivel_dificuldade": "medio",
    },
    # ---------------- FILOSOFIA ----------------
    {
        "enunciado": "Qual filósofo grego é considerado o autor da célebre frase 'Só sei que nada sei'?",
        "disciplina": "Filosofia",
        "alternativas": "A) Platão, B) Aristóteles, C) Sócrates, D) Pitágoras, E) Heráclito",
        "resposta_correta": "Sócrates",
        "nivel_dificuldade": "facil",
    },
    {
        "enunciado": "No campo da ética, a corrente filosófica que defende que uma ação é moralmente correta quando maximiza o bem-estar geral é chamada de:",
        "disciplina": "Filosofia",
        "alternativas": "A) Existencialismo, B) Utilitarismo, C) Estoicismo, D) Racionalismo, E) Empirismo",
        "resposta_correta": "Utilitarismo",
        "nivel_dificuldade": "dificil",
    },
    {
        "enunciado": "Para o filósofo francês René Descartes, qual é a primeira certeza absoluta alcançada através da dúvida metódica?",
        "disciplina": "Filosofia",
        "alternativas": "A) Deus existe, B) O mundo é uma ilusão, C) Penso, logo existo, D) A alma é imortal, E) Nada pode ser conhecido",
        "resposta_correta": "Penso, logo existo",
        "nivel_dificuldade": "medio",
    },
]

# Aulas de exemplo para o ENEM
aulas_mock = [
    {
        "titulo": "Matemática: Equações do 2º Grau",
        "disciplina": "Matemática",
        "url_video": "https://youtu.be/O52z4JSNisI?si=XvHXTR-t3QksiDbs",
        "descricao": "Revisão prática de conceitos essenciais para o ENEM."
    },
    {
        "titulo": "História: Era Vargas",
        "disciplina": "Ciências Humanas",
        "url_video": "https://youtu.be/C6IUgc_arhc?si=CcmEbT80Qu_HI0VC",
        "descricao": "Principais pontos cobrados na prova de Ciências Humanas."
    },
    {
        "titulo": "Física: Ondas",
        "disciplina": "Ciências Natureza",
        "url_video": "https://youtu.be/4w3PcXQ6Wd0?si=wwXcl4wucYYjopoP",
        "descricao": "Tudo sobre ondas para o ENEM."
    },
]


def seed_questoes(session: Session):
    """Cadastra as questões, caso o banco ainda não tenha nenhuma."""
    if session.exec(select(Questao)).first():
        print("⚠️  O banco já possui questões cadastradas — nenhuma nova questão foi criada.")
        return session.exec(select(Questao)).all()

    novas_questoes = []
    for q_data in questoes_mock:
        nova_questao = Questao(**q_data)
        session.add(nova_questao)
        novas_questoes.append(nova_questao)

    session.commit()
    for questao in novas_questoes:
        session.refresh(questao)

    print(f"✅ {len(novas_questoes)} questões do ENEM cadastradas com sucesso no banco de dados!")
    return novas_questoes


def seed_simulados(session: Session, questoes):
    """Cria simulados de exemplo e associa as questões correspondentes a cada um."""
    if session.exec(select(Simulado)).first():
        print("⚠️  O banco já possui simulados cadastrados — nenhum novo simulado foi criado.")
        return

    por_disciplina = {}
    for questao in questoes:
        por_disciplina.setdefault(questao.disciplina, []).append(questao)

    disciplinas_natureza = ["Matemática", "Física", "Química", "Biologia"]
    disciplinas_humanas = ["História", "Geografia", "Literatura", "Filosofia"]

    simulados_config = [
        {
            "titulo": "Simulado ENEM - Ciências da Natureza e Matemática",
            "descricao": "12 questões de Matemática, Física, Química e Biologia, no estilo do 1º dia de prova.",
            "disciplinas": disciplinas_natureza,
        },
        {
            "titulo": "Simulado ENEM - Linguagens e Ciências Humanas",
            "descricao": "12 questões de História, Geografia, Literatura e Filosofia, no estilo do 2º dia de prova.",
            "disciplinas": disciplinas_humanas,
        },
        {
            "titulo": "Simulado Relâmpago",
            "descricao": "Uma versão curta, com 5 questões variadas, ideal para testar rapidamente o cronômetro.",
            "disciplinas": None,
        },
    ]

    for config in simulados_config:
        simulado = Simulado(titulo=config["titulo"], descricao=config["descricao"])
        session.add(simulado)
        session.commit()
        session.refresh(simulado)

        if config["disciplinas"] is None:
            questoes_do_simulado = [lista[0] for lista in list(por_disciplina.values())[:5]]
        else:
            questoes_do_simulado = [q for d in config["disciplinas"] for q in por_disciplina.get(d, [])]

        for questao in questoes_do_simulado:
            session.add(SimuladoQuestao(simulado_id=simulado.id, questao_id=questao.id))

        session.commit()
        print(f"✅ Simulado '{simulado.titulo}' criado com {len(questoes_do_simulado)} questões.")


def seed_aulas(session: Session):
    """Cadastra as videoaulas no banco de dados."""
    if session.exec(select(ConteudoTeorico)).first():
        print("⚠️  O banco já possui videoaulas cadastradas — nenhuma nova aula foi criada.")
        return

    for a_data in aulas_mock:
        nova_aula = ConteudoTeorico(**a_data)
        session.add(nova_aula)

    session.commit()
    print(f"✅ {len(aulas_mock)} videoaulas cadastradas com sucesso no banco de dados!")


def seed_tudo():
    with Session(engine) as session:
        questoes = seed_questoes(session)
        seed_simulados(session, questoes)
        seed_aulas(session)


if __name__ == "__main__":
    seed_tudo()