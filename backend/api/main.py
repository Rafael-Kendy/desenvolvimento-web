import uvicorn #pra rodar, uvicorn api.main:app --reload
from fastapi import FastAPI, UploadFile, Form, File, Body
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List, Optional
from fastapi import HTTPException #pra codigo de erros

#pip install passlib[bcrypt]
#pip install 'pydantic[email]'
from pydantic import BaseModel, EmailStr #EmailStr faz uma validação básica de email
from passlib.context import CryptContext #pra criptografar senhas

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

#users
users = []  #guardando na memoria por enquanto
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")#configuração pro hashing de senha
class User(BaseModel): #estrutura do user
    id: int
    name: str
    email: EmailStr
    hashed_password: str

class UserCreate(BaseModel): #estrutura dos dados que vão chegar no front
    name: str
    email: EmailStr
    password: str
#users



#questoes --------------------------------------------------------------------------------------------

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


#edita a questao, segue a msm logica do email do delete
@app.put("/comunidade/{question_id}")
async def updateQuestion(question_id: int, email:str = Body(..., embed=True), name:str|None = Body(None), title:str|None = Body(None), question:str|None = Body(None)):
    global questions
    for q in questions: #percorre as questoes
        if q.id == question_id: #acha o id
            if q.email != email: #email errado
                raise HTTPException(status_code=403, detail="Email incorreto. Você não pode editar esta dúvida.")
            
            #email certo, att os dados
            if name is not None:
                q.name = name
            if title is not None:
                q.title = title
            if question is not None:
                q.question = question

            return {"message": f"Questão {question_id} atualizada com sucesso", "question": q}
    raise HTTPException(status_code=404, detail="Questão não encontrada")


#registro/usuarios -----------------------------------------------------------------------------------

#endpoint registro
@app.post("/registro", response_model=User)
async def register_user(user_data: UserCreate):
    for u in users: #verifica se o email existe
        if u.email == user_data.email:
            raise HTTPException(status_code=400, detail="Esse email já existe!!!")

    hashed_password = pwd_context.hash(user_data.password)#criptografa a senha

    new_user = User( #cria um novo usuário
        id=len(users) + 1,
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )

    users.append(new_user)#salva o usuario na lista
    
    print("Usuários cadastrados: ", users) #pra manter o controle
    
    return new_user
#endpoint registro

#rodar o server
if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
