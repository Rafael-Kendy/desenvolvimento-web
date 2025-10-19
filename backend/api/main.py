import uvicorn #pra rodar, uvicorn api.main:app --reload
from fastapi import FastAPI, UploadFile, Form, File, Body
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List, Optional
from fastapi import HTTPException #pra codigo de erros

app = FastAPI() #objeto base pra cuidar dos endpoint

origins = [
    "http://localhost:5173/", #front
    "http://localhost:8000/" #back
]

#vai permitir qlqr URL vindo da origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

questions = [] #guardando as questoes na memoria msm por enquanto, reseta com o server
class Question(BaseModel): #estrutura das questoes
    id: int
    name: str
    email: str
    title: str
    question: str
    image_url: str | None=None



#cria a nova duvida, retorna sucesso de der certo
@app.post("/comunidade")
async def setQuestion( #acessa os dados do formulario
    name: str=Form(...),
    email: str=Form(...),
    title: str=Form(...),
    question: str=Form(...),
    image: UploadFile | None = File(None)
):
    image_url=None
    if image:
        image_url=f"/fake/path/{image.filename}" #finge q salvou
    new_question=Question( #cria a questao
        id=len(questions)+1,
        name=name,
        email=email,
        title=title,
        question=question,
        image_url=image_url
    )
    questions.append(new_question) #guarda na memoria
    return {"message": "Questão adicionada", "question": new_question}



#pega todas as questoes
@app.get("/comunidade", response_model=List[Question])
async def getQuestions():
    return questions



#deleta 1 questao, se confirmar o email
@app.delete("/comunidade/{question_id}")
async def deleteQuestion(question_id: int, email: str = Body(..., embed=True)):
    global questions
    for q in questions: #percorre tds as questoes
        if q.id == question_id: #qnd acha pelo id
            if q.email != email: #digitou o email errado
                raise HTTPException(status_code=403, detail="Email incorreto. Você não pode deletar esta dúvida.")
            questions.remove(q) #digitou o certo
            return {"message": f"Questão {question_id} deletada com sucesso"}
    raise HTTPException(status_code=404, detail="Questão não encontrada")


#rodar o server
if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)