from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, questoes, simulados, conteudos, estudos, ia

app = FastAPI(
    title="API StudyUp Refatorada"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(questoes.router)
app.include_router(simulados.router)
app.include_router(conteudos.router)
app.include_router(estudos.router)
app.include_router(ia.router)
