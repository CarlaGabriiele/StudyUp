from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routes import auth, questoes, simulados, conteudos, ia

app = FastAPI(title="API StudyUp Refatorada")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(questoes.router)
app.include_router(simulados.router)
app.include_router(conteudos.router)
app.include_router(ia.router)