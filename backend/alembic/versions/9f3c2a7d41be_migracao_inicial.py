"""migracao_inicial

Revision ID: 9f3c2a7d41be
Revises: 
Create Date: 2026-10-16 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f3c2a7d41be'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'usuario',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nome', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('senha', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_usuario_email'), 'usuario', ['email'], unique=True)

    op.create_table(
        'questao',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('enunciado', sa.String(), nullable=False),
        sa.Column('alternativas', sa.String(), nullable=False),
        sa.Column('resposta_correta', sa.String(), nullable=False),
        sa.Column('nivel_dificuldade', sa.String(), nullable=False),
        sa.Column('disciplina', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'simulado',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('titulo', sa.String(), nullable=False),
        sa.Column('descricao', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'conteudoteorico',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('titulo', sa.String(), nullable=False),
        sa.Column('url_video', sa.String(), nullable=False),
        sa.Column('disciplina', sa.String(), nullable=False),
        sa.Column('concluido', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'simuladoquestao',
        sa.Column('simulado_id', sa.Integer(), nullable=False),
        sa.Column('questao_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['questao_id'], ['questao.id'], ),
        sa.ForeignKeyConstraint(['simulado_id'], ['simulado.id'], ),
        sa.PrimaryKeyConstraint('simulado_id', 'questao_id')
    )

    op.create_table(
        'registrodesempenho',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('estudante_id', sa.Integer(), nullable=False),
        sa.Column('questao_id', sa.Integer(), nullable=False),
        sa.Column('simulado_id', sa.Integer(), nullable=True),
        sa.Column('alternativa_escolhida', sa.String(), nullable=False),
        sa.Column('resultado', sa.Boolean(), nullable=False),
        sa.Column('tempo_gasto', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['estudante_id'], ['usuario.id'], ),
        sa.ForeignKeyConstraint(['questao_id'], ['questao.id'], ),
        sa.ForeignKeyConstraint(['simulado_id'], ['simulado.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'alternativaeliminada',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('estudante_id', sa.Integer(), nullable=False),
        sa.Column('questao_id', sa.Integer(), nullable=False),
        sa.Column('letra', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['estudante_id'], ['usuario.id'], ),
        sa.ForeignKeyConstraint(['questao_id'], ['questao.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('alternativaeliminada')
    op.drop_table('registrodesempenho')
    op.drop_table('simuladoquestao')
    op.drop_table('conteudoteorico')
    op.drop_table('simulado')
    op.drop_table('questao')
    op.drop_index(op.f('ix_usuario_email'), table_name='usuario')
    op.drop_table('usuario')
