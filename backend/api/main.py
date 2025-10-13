import uvicorn #pra rodar, uvicorn api.main:app --reload
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List

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

questions = [] #guardando as questoes na memoria msm por enquanto
class Question(BaseModel):
    id: int
    name: str
    email: str
    question: str
    image_url: str | None=None



#cria a nova duvida, retorna ela e sucesso de der certo
@app.post("/comunidade")
async def setQuestion(
    nane: str=Form(...),
    email: str=Form(...),
    question: str=Form(...),
    image: UploadFile | None=None
):
    image_url = None
    if image:
        image_url = f"/fake/path/{image.filename}"
    new_question = Question(
        id = len(questions)+1,
        name = name,
        email = email,
        question = question,
        image_url = image_url
    )
    questions.append(new_question)
    return {"message": "Question added!", "question": new_question}

#pega as questoes
@app.get("/comunidade", response_model=List[Question])
async def getQuestions():
    return questionsc



if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)