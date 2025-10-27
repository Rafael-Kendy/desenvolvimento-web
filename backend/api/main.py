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

#pip install "python-jose[cryptography]"
from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt #jose kkkkkk JSON object signing and encryption

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
#configura o passlib, diz p ele q quero usar o bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")#configuração pro hashing de senha

class User(BaseModel): #estrutura do user sque é salva
    id: int
    name: str
    email: EmailStr #faz validação automatica de email
    hashed_password: str
    description: str | None = None #p/ descrição no perfil


class UserCreate(BaseModel): #estrutura dos dados que vão chegar do front
    name: str
    email: EmailStr
    password: str 

#perfil
class UserPublic(BaseModel): #estrutura dos dados que vao ser enviado ao front
    id: int
    name: str
    email: EmailStr
    #nao tem a senha hashed pq n faz sentido enviar ela pro frotnend
    description: str | None = None

#dependencia de segurança, quando usar o OAuth2 a fastAPI procura por um cabeçalho Authorization: Bearer <token> na requisição
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")#tokenUrl informa que o endpoint de login é o /token
#perfil

#descriçaõ
class UserUpdate(BaseModel):#forma como espera receber os dados do front
    #o frontend não precisa enviar os dois campos ele pode enviar só o nom ou so a descrição ou os dois
    name: str | None = None
    description: str | None = None
#descrição

#login
#config do JWT (JSON web token)
SECRET_KEY = "FACA_O_L_IMEDIATAMENTE" #pode ser qualquer string longa e aleatória
ALGORITHM = "HS256" #algoritmo de assinatura
ACCESS_TOKEN_EXPIRE_MINUTES = 30 #tempo de validade do token

#funçao pra buscar o usuario na lista de usuario
def get_user(email: str):
    for u in users:
        if u.email == email:
            return u
    return None

#p/criar novo token de acesso
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    #define o tempo de exibiçaõ do token 
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    #assina o token com o secret_ket e algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
#login

#perfil
async def get_current_active_user(token: Annotated[str, Depends(oauth2_scheme)]):# o depends() faz a fastAPI pegar o token do cabeçalho e mandar ele p/ variavel token
    #token: Annotated pega o token do cabeçalho Authorization, abre ele, acha o email "sub", usa o email pra achar o user na lista de users,
    #endpoint ent retorna os dados em return current_user la em baixo~
    #response_model=UserPublic filtra para id, name, email
    
    #erro padrao
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        #tenta decodificar o token usando a senha secreta
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        #pega o email de dentro do token, q foi salvado como sub no endpoint /token
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception#se nao houver sub no token
    except JWTError:
        #se o token for inválido ou expirado msotra o erro
        raise credentials_exception
    
    #se o token for valido, busca o usuário na lista users
    user = get_user(email=email)
    if user is None:
        #se o usuário não existir mostra o erro
        raise credentials_exception
    return user
#perfil

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
@app.post("/registro", response_model=User)#response model define o formato, no caso User
async def register_user(user_data: UserCreate): #a API automaticamente pega o JSON do frontend, valida com o userCreate e joga, como um objeto, pro user_data
    
    for u in users: #verifica se o email existe
        if u.email == user_data.email:#se existe, cria o erro 400, q o front vai capturar 
            raise HTTPException(status_code=400, detail="Esse email já existe!")

    hashed_password = pwd_context.hash(user_data.password)#criptografa a senha

    new_user = User( #cria um novo usuário
        id=len(users) + 1,
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password, #salva a versao criptografada
        description="AAAAAAAA"
    )

    users.append(new_user)#salva o usuario na lista
    
    print("Usuários cadastrados: ", users) #pra manter o controle e ver no terminal
    
    return new_user#retonra o usuario criado, envia la pro frontend em registro.jsx
#endpoint registro

#login -----------------------------------------------------------------------------------

#endpoint login
#chamado qnd o usuario clica em entrar  
@app.post("/token")#fastAPI ve a req POST em /token
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]#o OAuth2PasswordRequestForm é um modelo especial do fastAPI e força o login a usar dados de formulário,
    #automaticamente pega os dados enviados pelo login e coloca no form_data
):
    #encontra o usuario
    user = get_user(form_data.username)#email vem do form.data_username 
    #pega os dados da lista de usuario feita no endpoint do /registro, ele procura na lista users por alguem com tal email
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    #verifica a senha
    if not pwd_context.verify(form_data.password, user.hashed_password):#o pwd_context.verify compara a senha que o usuário digitou
        raise HTTPException(#se der ruim, erro 401 nao autorizado
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    #se deu bom, cria um token pro usuario
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        #sub de subject é o nome padrão para guardar a identidade do usuário (o email)
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    #retorna o token pro frontend
    return {"access_token": access_token, "token_type": "bearer"}
#endpoint login

#perfil -----------------------------------------------------------------------------------

#endpoint perfil GET
@app.get("/users/me", response_model=UserPublic)
async def read_users_me(

    #depend() faz com que antes de executar rode o get_current_active q funciona como um guarda costas
    current_user: Annotated[User, Depends(get_current_active_user)]
    #se falhar retorna o erro 401
    #se der certo retorna o user e coloca ele no current_user
):
    #mesmo q retorne o current_user completo pro front ele n vai retornar a senha
    return current_user
#endpoint perfil GET

#configurações -----------------------------------------------------------------------------------

#endpoint config DELETE
@app.delete("/users/me")
async def delete_user_me(
    #usa o get_current_active_user p/ pegar o token do cabeçalho da requisiçãoe encontrar o usuario na lista users e colocar no current_user
    current_user: Annotated[User, Depends(get_current_active_user)] #se o token for inválido, ele já falha aqui
):
    #se o token for válido, current_user tem o usuário e pode ser remmovido 
    try:
        users.remove(current_user)#remove itens da lista de usuarios q eh criada pelo endpoint /registro
        print("Usuário deletado:", current_user)
        return {"Usuário deletado com sucesso"}
    except ValueError:
        #se current_user n estiver na lista users
        raise HTTPException(status_code=404, detail="Usuário não encontrado")#checagem dupla,eh oq o get_current_active_user já checa,
#endpoint config DELETE

#descrição perfil -----------------------------------------------------------------------------------

#endpoint perfil UPDATE
@app.put("/users/me", response_model=UserPublic)
async def update_user_me(
    # pega os dados a serem atualizados do corpo da requisição, fastAPI valida se o JSON enviado bate com o modelo UserUpdate
    user_update: UserUpdate,
    
    #usa o get_current_active_user para pegar o token do cabeçalho e validar ele, alem de dar o objeto user
    current_user: Annotated[User, Depends(get_current_active_user)]#o usuário só pode editar a si mesmo
):
    #atualiza os campos se o frontend enviou um name q nao eh nulo
    if user_update.name is not None:
        current_user.name = user_update.name#atualiza o nome
    
    #atualiza os campos se o frontend enviou uma descrição q nao eh nula
    if user_update.description is not None:
        current_user.description = user_update.description#atualiza a descrição
        
    print("Usuário atualizado:", current_user) 
    
    #retorna o usuário com os dados atualizados, o response_model=UserPublic garante que a senha hash não vaze
    return current_user
#endpoint perfil PUT


#rodar o server
if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
