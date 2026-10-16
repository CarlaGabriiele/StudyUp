from sqlmodel import Session
from models import ConteudoTeorico
from repositories.conteudo_repository import ConteudoRepository

# Lista padrão de aulas completa
AULAS_PADRAO = [
    {
        "titulo": "Matemática: Equações do 2º Grau",
        "disciplina": "Matemática",
        "url_video": "https://www.youtube.com/embed/tlskrkjRMsI",
        "descricao": "Revisão prática de conceitos essenciais para o ENEM."
    },
    {
        "titulo": "História: Era Vargas",
        "disciplina": "Ciências Humanas",
        "url_video": "https://www.youtube.com/embed/jQU6Ojetq8M",
        "descricao": "Principais pontos cobrados na prova de Ciências Humanas."
    },
    {
        "titulo": "Física: Ondas",
        "disciplina": "Ciências da Natureza",
        "url_video": "https://www.youtube.com/embed/4w3PcXQ6Wd0",
        "descricao": "Tudo sobre ondas para o ENEM."
    },
    {
        "titulo": "Português: Figuras de Linguagem",
        "disciplina": "Linguagens",
        "url_video": "https://www.youtube.com/embed/S8kdKKdwv6E",
        "descricao": "Principais figuras de linguagem cobradas no ENEM."
    },
    {
        "titulo": "Redação: Estrutura da Dissertação",
        "disciplina": "Redação",
        "url_video": "https://www.youtube.com/embed/MeKHJVPNV30",
        "descricao": "Como estruturar uma redação nota 1000 no ENEM."
    }
]

class ConteudoService:
    @staticmethod
    def listar_videoaulas(session: Session):
        # Busca o que já existe no banco
        aulas_banco = ConteudoRepository.listar(session)
        titulos_existentes = {a.titulo for a in aulas_banco}

        # Se faltar alguma aula da lista padrão, cadastra ela no banco SQLite automaticamente
        novas_aulas = []
        for a_data in AULAS_PADRAO:
            if a_data["titulo"] not in titulos_existentes:
                novas_aulas.append(ConteudoTeorico(**a_data))

        if novas_aulas:
            ConteudoRepository.salvar_varios(session, novas_aulas)
            aulas_banco = ConteudoRepository.listar(session)

        urls_embed = [
            'https://www.youtube.com/embed/tlskrkjRMsI',
            'https://www.youtube.com/embed/jQU6Ojetq8M',
            'https://www.youtube.com/embed/4w3PcXQ6Wd0',
            'https://www.youtube.com/embed/S8kdKKdwv6E',
            'https://www.youtube.com/embed/MeKHJVPNV30',
        ]

        for index, url in enumerate(urls_embed):
            if len(aulas_banco) > index:
                aulas_banco[index].url_video = url

        return aulas_banco
