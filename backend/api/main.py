import uvicorn #pra rodar
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List

#Kendy: algumas coisas enquanto to aprendendo, vou deixar q talvez seja util dps
#   retirado de https://www.youtube.com/watch?v=aSdVU9-SxH4
class Fruit(BaseModel):
    name: str
class Fruits(BaseModel):
    frutas: List[Fruit]

app = FastAPI()

origins = [
    "http://localhost:5173/",
    "http://localhost:8000/"
]

#vai permitir qlqr URL vindo da origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#db em memoria, so pra testar
memory_db={"frutas":[]}

@app.get("/fruits", response_model=Fruits) #response_model é o tipo q vai retornar
def getFruits():
    return Fruits(frutas=memory_db["frutas"])

@app.post("/fruits", response_model=Fruit)
def addFruit(fruta: Fruit):
    memory_db["frutas"].append(fruta)
    return fruta

if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)