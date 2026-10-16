from fastapi import HTTPException
from sqlmodel import Session
from models import Simulado, SimuladoQuestao, RegistroDesempenho, Usuario
from repositories.simulado_repository import SimuladoRepository
from repositories.questao_repository import QuestaoRepository
from repositories.registro_desempenho_repository import RegistroDesempenhoRepository

class SimuladoService:
    @staticmethod
    def adicionar_questao(session: Session, simulado_id: int, questao_id: int):
        simulado = SimuladoRepository.buscar_por_id(session, simulado_id)
        questao = QuestaoRepository.buscar_por_id(session, questao_id)

        if not simulado or not questao:
            raise HTTPException(status_code=404, detail="Simulado ou Questão não encontrada.")

        relacao_existente = SimuladoRepository.buscar_relacao(session, simulado_id, questao_id)
        if relacao_existente:
            raise HTTPException(status_code=400, detail="Esta questão já pertence a este simulado.")

        nova_relacao = SimuladoQuestao(simulado_id=simulado_id, questao_id=questao_id)
        SimuladoRepository.salvar_relacao(session, nova_relacao)

        return {"message": "Questão associada ao simulado com sucesso!"}

    @staticmethod
    def criar(session: Session, simulado: Simulado):
        return SimuladoRepository.salvar(session, simulado)

    @staticmethod
    def listar(session: Session):
        return SimuladoRepository.listar(session)

    @staticmethod
    def obter(session: Session, simulado_id: int):
        simulado = SimuladoRepository.buscar_por_id(session, simulado_id)
        if not simulado:
            raise HTTPException(status_code=404, detail="Simulado não encontrado.")

        return {
            "id": simulado.id,
            "titulo": simulado.titulo,
            "descricao": simulado.descricao,
            "questoes": simulado.questoes
        }

    @staticmethod
    def atualizar(session: Session, simulado_id: int, simulado_atualizado: Simulado):
        db_simulado = SimuladoRepository.buscar_por_id(session, simulado_id)
        if not db_simulado:
            raise HTTPException(status_code=404, detail="Simulado não encontrado.")

        simulado_data = simulado_atualizado.model_dump(exclude_unset=True)
        for key, value in simulado_data.items():
            if key != "id":
                setattr(db_simulado, key, value)

        return SimuladoRepository.salvar(session, db_simulado)

    @staticmethod
    def deletar(session: Session, simulado_id: int):
        simulado = SimuladoRepository.buscar_por_id(session, simulado_id)
        if not simulado:
            raise HTTPException(status_code=404, detail="Simulado não encontrado.")

        SimuladoRepository.deletar(session, simulado)
        return {"message": "Simulado deletado com sucesso!"}

    @staticmethod
    def submeter(session: Session, simulado_id: int, data, current_user: Usuario):
        simulado = SimuladoRepository.buscar_por_id(session, simulado_id)
        if not simulado:
            raise HTTPException(status_code=404, detail="Simulado não encontrado.")

        if not simulado.questoes:
            raise HTTPException(status_code=400, detail="Este simulado não possui questões cadastrais.")

        total_questoes = len(simulado.questoes)
        acertos = 0
        detalhes_resposta = []
        registros = []

        tempo_medio_por_questao = int(data.tempo_total_segundos / total_questoes) if total_questoes > 0 else 0

        for questao in simulado.questoes:
            resposta_aluno = data.respostas.get(questao.id, "").strip().upper()
            acertou = (resposta_aluno == questao.resposta_correta.strip().upper())

            if acertou:
                acertos += 1

            registro = RegistroDesempenho(
                estudante_id=current_user.id,
                questao_id=questao.id,
                simulado_id=simulado.id,
                alternativa_escolhida=resposta_aluno,
                resultado=acertou,
                tempo_gasto=tempo_medio_por_questao
            )
            registros.append(registro)

            detalhes_resposta.append({
                "questao_id": questao.id,
                "resposta_aluno": resposta_aluno,
                "gabarito": questao.resposta_correta,
                "correto": acertou
            })

        RegistroDesempenhoRepository.salvar_varios(session, registros)

        porcentagem_acerto = round((acertos / total_questoes) * 100, 2)

        return {
            "simulado_id": simulado_id,
            "total_questoes": total_questoes,
            "acertos": acertos,
            "erros": total_questoes - acertos,
            "nota_porcentagem": porcentagem_acerto,
            "tempo_total_segundos": data.tempo_total_segundos,
            "detalhes": detalhes_resposta
        }
