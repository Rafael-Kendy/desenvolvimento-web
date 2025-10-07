from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #pra ligar o front com o back

app = FastAPI()

#faz a ligação com o front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #servidor do react
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#endpoints
@app.get("/")
def root(): #root só pra teste
    return {"message": "Bem vindo ao site"}

@app.get("/api/teste")
def get_data():
    return {"name": "FastAPI", "language": "Python", "status": "Rodando"}