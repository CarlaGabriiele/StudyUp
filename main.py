from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List

app = FastAPI(title="Sistema de Biblioteca")

livros = [
    {"id": 1, "titulo": "Dom Casmurro", "autor": "Machado de Assis", "status": "disponivel"},
    {"id": 2, "titulo": "1984", "autor": "George Orwell", "status": "disponivel"}
]
usuarios = []
emprestimos = []


class LivroModel(BaseModel):
    id: int
    titulo: str
    autor: str

class UsuarioModel(BaseModel):
    id: int
    nome: str

@app.get("/livros")
def listar_livros():
    disponiveis = []
    for l in livros:
        if l["status"] == "disponivel":
            disponiveis.append(l)
    return disponiveis

@app.post("/livros")
def criar_livro(livro: LivroModel):
    novo = livro.dict()
    novo["status"] = "disponivel"
    livros.append(novo)
    return novo

@app.get("/livros/{livro_id}")
def buscar_livro(livro_id: int):
    for l in livros:
        if l["id"] == livro_id:
            return l
    raise HTTPException(status_code=404, detail="Livro não encontrado")

@app.put("/livros/{livro_id}")
def atualizar_livro(livro_id: int, dados: LivroModel):
    for l in livros:
        if l["id"] == livro_id:
            l["titulo"] = dados.titulo
            l["autor"] = dados.autor
            return l
    raise HTTPException(status_code=404, detail="Livro não encontrado")

@app.delete("/livros/{livro_id}")
def deletar_livro(livro_id: int):
    for i in range(len(livros)):
        if livros[i]["id"] == livro_id:
            del livros[i]
            return {"mensagem": "Livro deletado"}
    raise HTTPException(status_code=404, detail="Livro não encontrado")

@app.get("/usuarios")
def listar_usuarios():
    return usuarios

@app.post("/usuarios")
def criar_usuario(usuario: UsuarioModel):
    usuarios.append(usuario.dict())
    return usuario

@app.get("/usuarios/{usuario_id}")
def buscar_usuario(usuario_id: int):
    for u in usuarios:
        if u["id"] == usuario_id:
            return u
    raise HTTPException(status_code=404, detail="Usuario não encontrado")

@app.put("/usuarios/{usuario_id}")
def atualizar_usuario(usuario_id: int, dados: UsuarioModel):
    for u in usuarios:
        if u["id"] == usuario_id:
            u["nome"] = dados.nome
            return u
    raise HTTPException(status_code=404, detail="Usuario não encontrado")

@app.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int):
    for i in range(len(usuarios)):
        if usuarios[i]["id"] == usuario_id:
            del usuarios[i]
            return {"mensagem": "Usuario deletado"}
    raise HTTPException(status_code=404, detail="Usuario não encontrado")

@app.post("/emprestimos")
def fazer_emprestimo(usuario_id: int, livro_id: int):
    livro_alvo = None
    for l in livros:
        if l["id"] == livro_id:
            livro_alvo = l
            break
            
    if not livro_alvo or livro_alvo["status"] != "disponivel":
        raise HTTPException(status_code=400, detail="Livro indisponível")

    novo_emp = {
        "id": len(emprestimos) + 1,
        "usuario_id": usuario_id,
        "livro_id": livro_id,
        "prazo": datetime.now() + timedelta(days=7),
        "devolvido": False
    }
    
    livro_alvo["status"] = "emprestado"
    emprestimos.append(novo_emp)
    return novo_emp

@app.put("/emprestimos/{emprestimo_id}/devolver")
def devolver_livro(emprestimo_id: int):
    for e in emprestimos:
        if e["id"] == emprestimo_id:
            e["devolvido"] = True
            for l in livros:
                if l["id"] == e["livro_id"]:
                    l["status"] = "disponivel"
            return {"mensagem": "Livro devolvido com sucesso"}
    raise HTTPException(status_code=404, detail="Empréstimo não encontrado")

@app.get("/emprestimos/atrasados")
def listar_atrasados():
    agora = datetime.now()
    lista = []
    for e in emprestimos:
        if not e["devolvido"] and e["prazo"] < agora:
            lista.append(e)
    return lista