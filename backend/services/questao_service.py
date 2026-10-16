from fastapi import HTTPException
from sqlmodel import Session
from models import Questao, RegistroDesempenho, AlternativaEliminada, Usuario
from repositories.questao_repository import QuestaoRepository
from repositories.registro_desempenho_repository import RegistroDesempenhoRepository
from repositories.alternativa_eliminada_repository import AlternativaEliminadaRepository

class QuestaoService:
    @staticmethod
    def responder(session: Session, data, current_user: Usuario):
        questao = QuestaoRepository.buscar_por_id(session, data.questao_id)
        if not questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")

        resposta_aluno = data.alternativa_escolhida.strip().upper()
        acertou = (resposta_aluno == questao.resposta_correta.strip().upper())

        registro = RegistroDesempenho(
            estudante_id=current_user.id,
            questao_id=questao.id,
            alternativa_escolhida=resposta_aluno,
            resultado=acertou,
            tempo_gasto=data.tempo_gasto
        )
        RegistroDesempenhoRepository.salvar(session, registro)

        return {
            "acertou": acertou,
            "gabarito": questao.resposta_correta,
            "mensagem": "Parabéns, você acertou!" if acertou else "Não foi dessa vez, tente dar uma revisada no assunto!"
        }

    @staticmethod
    def criar(session: Session, questao: Questao):
        return QuestaoRepository.salvar(session, questao)

    @staticmethod
    def listar(session: Session):
        return QuestaoRepository.listar(session)

    @staticmethod
    def obter(session: Session, questao_id: int):
        questao = QuestaoRepository.buscar_por_id(session, questao_id)
        if not questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")
        return questao

    @staticmethod
    def atualizar(session: Session, questao_id: int, questao_atualizada: Questao):
        db_questao = QuestaoRepository.buscar_por_id(session, questao_id)
        if not db_questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")

        questao_data = questao_atualizada.model_dump(exclude_unset=True)
        for key, value in questao_data.items():
            if key != "id":
                setattr(db_questao, key, value)

        return QuestaoRepository.salvar(session, db_questao)

    @staticmethod
    def deletar(session: Session, questao_id: int):
        questao = QuestaoRepository.buscar_por_id(session, questao_id)
        if not questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")

        QuestaoRepository.deletar(session, questao)
        return {"message": "Questão deletada com sucesso!"}

    @staticmethod
    def listar_alternativas_eliminadas(session: Session, current_user: Usuario):
        eliminadas = AlternativaEliminadaRepository.listar_por_estudante(session, current_user.id)
        return [{"questao_id": e.questao_id, "letra": e.letra} for e in eliminadas]

    @staticmethod
    def eliminar_alternativa(session: Session, questao_id: int, letra: str, current_user: Usuario):
        questao = QuestaoRepository.buscar_por_id(session, questao_id)
        if not questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")

        letra = letra.strip().upper()
        ja_eliminada = AlternativaEliminadaRepository.buscar(session, current_user.id, questao_id, letra)
        if ja_eliminada:
            raise HTTPException(status_code=400, detail="Esta alternativa já foi eliminada.")

        nova_eliminada = AlternativaEliminada(
            estudante_id=current_user.id,
            questao_id=questao_id,
            letra=letra
        )
        AlternativaEliminadaRepository.salvar(session, nova_eliminada)
        return {"message": "Alternativa eliminada com sucesso!"}

    @staticmethod
    def restaurar_alternativa(session: Session, questao_id: int, letra: str, current_user: Usuario):
        letra = letra.strip().upper()
        eliminada = AlternativaEliminadaRepository.buscar(session, current_user.id, questao_id, letra)
        if not eliminada:
            raise HTTPException(status_code=404, detail="Esta alternativa não está eliminada.")

        AlternativaEliminadaRepository.deletar(session, eliminada)
        return {"message": "Alternativa restaurada com sucesso!"}
