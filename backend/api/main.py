import uvicorn #pra rodar, uvicorn api.main:app --reload
from fastapi import FastAPI, UploadFile, Form, File, Body
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List, Optional, Dict, Any
from fastapi import HTTPException #pra codigo de erros
from contextlib import asynccontextmanager
import os

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
import hashlib #p/ usar o gravatar
import httpx # p usar o unsplash

#coisa pro bd
from sqlmodel import SQLModel, Session, select
from .database import engine, get_session # se tiver dando errado, ve o caminho de database e model
from .model import User, Question, Course, Section, Lesson, Step, UserLessonProgress

#=====================================================================================================================================================
#parte do banco de dados

# USUÁRIOS DE TESTE:
# user1@teste.com / 123 (normal)
# user2@teste.com / 123 (premium/admin)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("------------------ INICIANDO O LIFESPAN ------------------")
    
    # 1. Cria as tabelas
    SQLModel.metadata.create_all(engine)
    print("--- TABELAS CRIADAS ---")

    # 2. Popula o banco
    with Session(engine) as session:

        user_check = session.exec(select(User)).first()
        if not user_check:
            print("--- CRIANDO USUÁRIOS DE TESTE ---")
            
            # Usuário Normal
            user_normal = User(
                name="Usuario Normal",
                email="user1@teste.com",
                hashed_password=pwd_context.hash("123"),
                description="Conta gratuita de teste",
                is_premium=False
            )
            session.add(user_normal)

            # Usuário Premium (Admin)
            user_admin = User(
                name="Admin Premium",
                email="user2@teste.com",
                hashed_password=pwd_context.hash("123"),
                description="Conta premium de teste",
                is_premium=True
            )
            session.add(user_admin)
            session.commit() # Salva os usuários
            print("----- USUÁRIOS DE TESTE CRIADOS --------")

        course_check = session.exec(select(Course)).first()
        
        if not course_check:
            print("--------------- BANCO VAZIO DETECTADO, ENCHENDO ------------------")
            
            # curso 1
            c1 = Course(title="Internet", description="Aprenda o que é internet.", image="internet.png")
            session.add(c1)
            session.flush() # ID do Curso 1

            s1 = Section(title="Conceitos Básicos", course_id=c1.id)
            session.add(s1)
            session.flush() # gera ID da seção 1

            l101 = Lesson(id=101, title="O que é a Internet", section_id=s1.id, video_url="/videos/o-que-e-internet.mp4", header_image_url="")
            session.add(l101)
            session.add(Step(text="A internet é uma rede global.", lesson=l101))
            session.add(Step(text="Conecta bilhões de dispositivos.", lesson=l101))

            l102 = Lesson(id=102, title="Navegadores", section_id=s1.id, header_image_url="")
            session.add(l102)
            session.add(Step(text="Navegadores interpretam HTML.", lesson=l102))

            # curso 2
            c2 = Course(title="Computadores", description="Hardware e Software.", image="computer-desktop.png")
            session.add(c2)
            session.flush() # gera ID do curso 2
            
            s2 = Section(title="Hardware", course_id=c2.id)
            session.add(s2)
            session.flush() # 
            
            # s2.id existe pelo flush
            session.add(Lesson(id=201, title="Mouse e Teclado", section_id=s2.id))

            # curso 3 premium
            c3 = Course(title="Chamadas (PREMIUM)", description="Aprenda a fazer chamadas.", image="phone-call.png")
            session.add(c3)
            session.flush() # ID Curso 3
            
            s3 = Section(title="Apps", course_id=c3.id)
            session.add(s3)
            session.flush() # 
            
            session.add(Lesson(id=301, title="Videochamada", section_id=s3.id))

            session.commit()
            print("----------- DADOS INSERIDOS COM SUCESSO -------------")
        else:
            print("---------------- O BANCO JÁ TEM DADOS, NÃO PRECISA PREENCHER --------------------")
            
    yield
    print("--- ENCERRANDO SERVIDOR ---")

app = FastAPI(lifespan=lifespan) #objeto base pra cuidar dos endpoint

origins = [
    "http://localhost:5173", #front
    "http://localhost:8000", #back
    "https://chave-digital.onrender.com", #back hosteado no render
    "https://desenvolvimento-web-frontend.onrender.com" #front do render
]

#vai permitir qlqr URL vindo da origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#=====================================================================================================================================================
#questoes

# questions = [] #guardando as questoes na memoria msm por enquanto, reseta com o server
# class Question(BaseModel): #estrutura das questoes
#     id: int
#     name: str
#     email: str
#     title: str
#     question: str
#     image_url: str | None=None

#cria a nova duvida, retorna sucesso de der certo
@app.post("/comunidade")
async def setQuestion( #acessa os dados do formulario
    name: str=Form(...),
    email: str=Form(...),
    title: str=Form(...),
    question: str=Form(...),
    image: UploadFile | None = File(None),
    session = Depends(get_session),
):
    image_url = f"/fake/path/{image.filename}" if image else None #ainda finge que salvou

    new_question = Question( #cria a questao
        name=name,
        email=email,
        title=title,
        question=question,
        image_url=image_url
    )
    session.add(new_question)
    session.commit()
    session.refresh(new_question)

    return {"message": "Questão adicionada", "question": new_question}



#pega as duvidas
@app.get("/comunidade")
def get_questions(session: Session = Depends(get_session)):
    return session.exec(select(Question)).all()



#deleta 1 questao, se confirmar o email
@app.delete("/comunidade/{question_id}")
async def delete_question(
    question_id: int,
    email: str = Body(..., embed=True),
    session = Depends(get_session),
):
    q = session.get(Question, question_id) #pega direto pelo id
    if not q:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    if q.email != email: #digitou o email errado
        raise HTTPException(status_code=403, detail="Email incorreto. Você não pode deletar esta dúvida.")

    session.delete(q) #qnd acha pelo id e email certo
    session.commit() #confirma no banco
    return {"message": f"Questão {question_id} deletada com sucesso"}



#edita a questao, segue a msm logica do email do delete
@app.put("/comunidade/{question_id}")
async def update_question(
    question_id: int,
    email: str = Body(..., embed=True),
    name: str | None = Body(None),
    title: str | None = Body(None),
    question: str | None = Body(None),
    session = Depends(get_session),
):
    q = session.get(Question, question_id) #pega direto pelo id
    if not q:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    if q.email != email: #email errado
        raise HTTPException(status_code=403, detail="Email incorreto. Você não pode editar esta dúvida.")
    #atualiza os dados, ainda to ignorando a imagem
    if name is not None:
        q.name = name
    if title is not None:
        q.title = title
    if question is not None:
        q.question = question

    session.add(q)
    session.commit()
    session.refresh(q)

    return {"message": "Questão atualizada com sucesso", "question": q}



#=====================================================================================================================================================



#users
#users = []  #guardando na memoria por enquanto
#configura o passlib, diz p ele q quero usar o bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")#configuração pro hashing de senha
#class User(BaseModel): #estrutura do user sque é salva
#    id: int
#    name: str
#    email: EmailStr #faz validação automatica de email
#    hashed_password: str
#    description: str | None = None #p/ descrição no perfil
#    is_premium: bool = False

#converter usuario do bd para uusario publico
def user_to_public(user: User) -> "UserPublic":
    email_address = user.email.lower().strip()
    md5_hash = hashlib.md5(email_address.encode('utf-8')).hexdigest()
    avatar_url = f"https://www.gravatar.com/avatar/{md5_hash}?d=identicon"

    return UserPublic(
        id=user.id,
        name=user.name,
        email=user.email,
        description=user.description,
        avatar_url=avatar_url
    )


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
    avatar_url: str

#dependencia de segurança, quando usar o OAuth2 a fastAPI procura por um cabeçalho Authorization: Bearer <token> na requisição
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")#tokenUrl informa que o endpoint de login é o /token
#perfil

#descriçaõ
class UserUpdate(BaseModel):#forma como espera receber os dados do front
    #o frontend não precisa enviar os dois campos ele pode enviar só o nom ou so a descrição ou os dois
    name: str | None = None
    description: str | None = None
#descrição

class NewCoursePayload(BaseModel): # curso novo
    title: str
    description: str
    image: str

class CourseUpdate(BaseModel): # atualizar curso
    title: str | None = None
    description: str | None = None
    image: str | None = None

# modelo de resposta para garantir que o FastAPI converta tudo certinho
class LessonContentResponse(BaseModel):
    lesson_id: int
    title: str
    video_url: Optional[str] = None
    steps: List[Dict[str, str]]
    course_id: int
    next_lessons: List[Dict[str, Any]] = []
    header_image_url: Optional[str] = None

# 1. Schema da Lição (simples)
class LessonRead(BaseModel):
    id: int
    title: str
    video_url: Optional[str] = None
    class Config:
        from_attributes = True # ajuste pra funcionar com o SQLModel, fala que os dados vem de ORM

# 2. Schema da Seção (com lista de lições dentro)
class SectionRead(BaseModel):
    id: int
    title: str
    lessons: List[LessonRead] = [] # <--- AQUI ESTÁ O SEGREDO
    class Config:
        from_attributes = True

# 3. Schema do Curso (com lista de seções dentro)
class CourseReadWithDetails(BaseModel):
    id: int
    title: str
    description: str
    image: str
    sections: List[SectionRead] = [] # <--- AQUI TAMBÉM
    class Config:
        from_attributes = True

#classes pras checkbox
class ProgressUpdate(BaseModel):
    #o que o front coloca no PUT
    completado: bool

# bando de dados na memória p salvar o progresso da checkbox - RETIRADO NO DB
#user_progress = [] 


#login
#config do JWT (JSON web token)
SECRET_KEY = "FACA_O_L_IMEDIATAMENTE" #pode ser qualquer string longa e aleatória
ALGORITHM = "HS256" #algoritmo de assinatura
ACCESS_TOKEN_EXPIRE_MINUTES = 30 #tempo de validade do token

#funçao pra buscar o usuario na lista de usuario (retirado no)
#def get_user(email: str):
#    for u in users:
#        if u.email == email:
#            return u
#    return None

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
async def get_current_active_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    # o depends() faz a fastAPI pegar o token do cabeçalho e mandar ele p/ variavel token
    #token: Annotated pega o token do cabeçalho Authorization, abre ele, acha o email "sub", usa o email pra achar o user na lista de users,
    #endpoint ent retorna os dados em return current_user la em baixo~
    #response_model=UserPublic filtra para id, name, email

    #session... é onde é feita a conexão com o bd, é como se ela fosse uma area de trabalho temporaria que pode ser aberta p/ fazer uma req e fechada ao terminar
    
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
    
    #busca no sql, seleciona a tabela user onde o campo email é igual ao email do token
    statement = select(User).where(User.email == email)

    #executa no banco e pega o primeiro resultado, se achar retorna o objeto user preenchido com dados do banco
    #se n achar retorna none
    user = session.exec(statement).first()

    if user is None:
        #se o usuário não existir mostra o erro
        raise credentials_exception
    return user
#perfil

#registro/usuarios -----------------------------------------------------------------------------------

#endpoint registro
@app.post("/registro", response_model=UserPublic)#response model define o formato, no caso UserPublic no retorno pra esconder a senha
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)): #a API automaticamente pega o JSON do frontend, valida com o userCreate e joga, como um objeto, pro user_data

    #session... é onde é feita a conexão com o bd
    
    #verifica no bd se o email existe, por meio de um select
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Esse email já existe") 


    hashed_password = pwd_context.hash(user_data.password)#criptografa a senha

    #cria-se uma instancia da classe user, uma tabela sql
    new_user = User( #cria um novo usuário
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password, #salva a versao criptografada
        description="AAAAAAAA",
        is_premium=False
    )

    #salva no bd
    session.add(new_user)#avisa q tem um novo registro, dado ainda n esta salvo permanentemente
    session.commit()#grava tudo no arquivo .db, aqui eh onde gera o id e o dado salvo permanentemente
    session.refresh(new_user) #atualiza o new_user e tem o id gerado pelo bd, crucial p/ pegar o id q foi gerado automaticamente
    
    print("Novo usuário registrado, id:", new_user.id)
    
    return user_to_public(new_user)#retonra o usuario criado, envia la pro frontend em registro.jsx
#endpoint registro

#login -----------------------------------------------------------------------------------

#endpoint login
#chamado qnd o usuario clica em entrar  
@app.post("/token")#fastAPI ve a req POST em /token
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],session: Session = Depends(get_session)):
    #o OAuth2PasswordRequestForm é um modelo especial do fastAPI e força o login a usar dados de formulário,
    #automaticamente pega os dados enviados pelo login e coloca no form_data
    print(f"DEBUG LOGIN -> Recebi: '{form_data.username}' | Senha: '{form_data.password}'")
    user_test = session.exec(select(User).where(User.email == form_data.username)).first()
    if user_test:
        print(f"DEBUG BANCO -> Achei usuário! Hash no banco: {user_test.hashed_password[:10]}...")
    else:
        print("DEBUG BANCO -> Usuário NÃO encontrado no select.")
    #busca no bd um usuario com o email q foi digitado no login
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()

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
    return {"access_token": access_token, "token_type": "bearer", "is_premium": user.is_premium}
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
    
    #pega o email do usuario e formata com letras minusculas e sem espaço
    email_address = current_user.email.lower().strip()
    
    #cria o hash MD5 do email, requisito do gravatar
    md5_hash = hashlib.md5(email_address.encode('utf-8')).hexdigest()
    
    #url da API do gravatar, nao eh chamada com um api.get
    avatar_url = f"https://www.gravatar.com/avatar/{md5_hash}?d=identicon"#md5 eh o identificador do usuario
    # ?d=identicon eh pra ver se o usuario ja tem foto, se n tiver o gravatar ira gerar um icone geometrico como foto
    
    #
    return UserPublic(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        description=current_user.description,
        avatar_url=avatar_url #envia a URL para o frontend, perfil.jsx recebe em response.data.avatar_url
    )

    return user_to_public(current_user)
#endpoint perfil GET

#configurações -----------------------------------------------------------------------------------

#endpoint config DELETE
@app.delete("/users/me")
async def delete_user_me(current_user: Annotated[User, Depends(get_current_active_user)], session: Session = Depends(get_session)):
    #usa o get_current_active_user p/ pegar o token do cabeçalho da requisiçãoe encontrar o usuario na lista users e colocar no current_user
    #se o token for inválido, ele já falha aqui
    
    #current_user ja veio do banco de dados pelo get curent_active_user
    
    #se o token for válido, current_user tem o usuário e pode ser remmovido 
    try:
        session.delete(current_user) #deleta do bd
        session.commit() #confirmação da deletaçaõ
        return {"message": "Usuário deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao deletar usuário")
#endpoint config DELETE

#descrição perfil -----------------------------------------------------------------------------------

#endpoint perfil UPDATE
@app.put("/users/me", response_model=UserPublic)
async def update_user_me( user_update: UserUpdate,current_user: Annotated[User, Depends(get_current_active_user)], session: Session = Depends(get_session)):
    # pega os dados a serem atualizados do corpo da requisição, fastAPI valida se o JSON enviado bate com o modelo UserUpdate
    #usa o get_current_active_user para pegar o token do cabeçalho e validar ele, alem de dar o objeto user

    #o current_user ja veio do banco pelo get current_active_user
    # o sqlmodel sabe q esse objeto esta conectado a uma linha especifica da tabela
    
    #atualiza os campos se o frontend enviou um name q nao eh nulo
    if user_update.name is not None:
        current_user.name = user_update.name#atualiza o nome
    
    #atualiza os campos se o frontend enviou uma descrição q nao eh nula
    if user_update.description is not None:
        current_user.description = user_update.description#atualiza a descrição

    #como current_user ja tem um id, o sqlmodel entende que é uma atualização, n um novo registro
    session.add(current_user) #marca para atualização
    session.commit() #salva no bd
    session.refresh(current_user) #pega os dados atualizados, garantindo q ta corretamente atualizado
    
    #retorna o usuário com os dados atualizados, o response_model=UserPublic garante que a senha hash não vaze
    return user_to_public(current_user)
#endpoint perfil PUT

#cursos -----------------------------------------------------------------------------------

#endpoint cursos GET - com BD
@app.get("/cursos", response_model=List[Course])
async def get_courses(session: Session = Depends(get_session)):
    return session.exec(select(Course)).all()
#endpoint cursos GET

#endpoint cursos especificos GET
@app.get("/cursos/{course_id}", response_model=CourseReadWithDetails)
async def get_course(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return course
#fim do curso especifico get

# conteudo da licao get
@app.get("/licoes/{lesson_id}", response_model=LessonContentResponse)
async def get_lesson_content(
    lesson_id: int, 
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Session = Depends(get_session)
    
):
    # busca no bd
    lesson_db = session.get(Lesson, lesson_id)
    
    if not lesson_db:
        raise HTTPException(status_code=404, detail="Lição não encontrada")

    # verifica se o user é premium!
    if lesson_id == 301 and not current_user.is_premium:
        raise HTTPException(status_code=403, detail="Esta lição é exclusiva para usuários Premium.")

    # formatação de dados no banco
    # o banco retorna objetos Step, mas o front espera só dicionários simples
    steps_formatted = [{"text": s.text} for s in lesson_db.steps]

    # lógica p/ próxima lição
    # busca a próxima lição da mesma seção que tenha ID maior que o atual
    next_lesson_stmt = select(Lesson).where(
        Lesson.section_id == lesson_db.section_id,
        Lesson.id > lesson_id
    ).limit(1)
    
    next_lesson_obj = session.exec(next_lesson_stmt).first()
    
    next_lessons_list = []
    if next_lesson_obj:
        next_lessons_list.append({"id": next_lesson_obj.id, "title": next_lesson_obj.title})

    # parte da API externa para criação de cabeçalho das lições
    
    header_image = None 
    # tenta pegar a chave do .env
    UNSPLASH_API_KEY = os.getenv("UNSPLASH_API_KEY")

    if UNSPLASH_API_KEY:
        query = lesson_db.title # usa o titulo da lição p fazer a busca na API
        try:
            async with httpx.AsyncClient() as client:
                headers = {"Authorization": f"Client-ID {UNSPLASH_API_KEY}"}
                params = {"query": query, "per_page": 1, "orientation": "landscape"}
                
                response = await client.get("https://api.unsplash.com/search/photos", headers=headers, params=params)
                
                # só processa se deu certo, 200 é OK
                if response.status_code == 200:
                    data = response.json()
                    if data["results"]:
                        header_image = data["results"][0]["urls"]["regular"]
        except Exception as e:
            print(f"Erro ao conectar com Unsplash: {e}")
            # header_image continua None e o site não quebra

    # agrega no retorno final
    return LessonContentResponse(
        lesson_id=lesson_db.id,
        title=lesson_db.title,
        video_url=lesson_db.video_url,
        steps=steps_formatted,
        course_id=lesson_db.section.course_id, # ID do curso via relacionamento
        next_lessons=next_lessons_list,
        header_image_url=header_image # url do unsplash pro header da lição
    )

#endpoint novo curso POST
@app.post("/cursos", response_model=Course, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: NewCoursePayload,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Session = Depends(get_session)
):
    if not current_user.is_premium: # Usando flag premium como admin simples
        raise HTTPException(status_code=403, detail="Apenas admins podem criar cursos.")
    
    new_course = Course(title=course_data.title, description=course_data.description, image=course_data.image)
    session.add(new_course)
    session.commit()
    session.refresh(new_course)
    return new_course
#fim endpoint novo curso POST

#endpoint atualizar curso PUT - BD
@app.put("/cursos/{course_id}", response_model=Course)
async def update_course(
    course_id: int,
    course_data: NewCoursePayload,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Session = Depends(get_session) # Injeção do Banco
):
    # AUTORIZAÇÃO - só deixa admins (premium) editarem cursos
    if not current_user.is_premium:
        raise HTTPException(status_code=403, detail="Apenas admins podem editar cursos.")

    # busca o curso no bd
    course_db = session.get(Course, course_id)
    
    if not course_db:
        raise HTTPException(status_code=404, detail=f"Curso {course_id} não encontrado.")

    # atualiza os campos com novos dados
    course_db.title = course_data.title
    course_db.description = course_data.description
    course_db.image = course_data.image
    
    # salva mudanças no bd
    session.add(course_db)
    session.commit()
    session.refresh(course_db)
    
    return course_db
#fim do endpoint atualizar curso PUT - BD

#endpoint DELETE curso - BD
@app.delete("/licoes/{licao_id}", status_code=status.HTTP_200_OK)
async def delete_lesson(
    licao_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Session = Depends(get_session) # <--- Injeção do Banco
):
    if not current_user.is_premium:
        raise HTTPException(status_code=403, detail="Apenas admins podem remover lições.")

    # busca a lição p ver se existe
    lesson_db = session.get(Lesson, licao_id)
    
    # se não der match no ID
    if not lesson_db:
        raise HTTPException(status_code=404, detail="Lição não encontrada.")

    # apagar lição do banco:
    # depende dos relacionamentos do SQLModel.
    # se tiver configurado cascade, somem as lições filhas.
    # se não, as lições ficam vivas mas órfãs, e talvez o BD avise.
    # por segurança, apaga os passos manualmente aqui.
    for step in lesson_db.steps:
        session.delete(step)
        
    # depois apaga a lição
    session.delete(lesson_db)
    
    session.commit()# adivinha o que faz

    return {"detail": f"Lição {licao_id} removida com sucesso."}
#fim do endpoint DELETE cursos - BD

# checar progresso get
@app.get("/progresso/curso/{course_id}", response_model=List[int])
async def get_progresso(course_id: int, current_user: Annotated[User, Depends(get_current_active_user)], session: Session = Depends(get_session)):
    # Retorna IDs das lições concluídas pelo usuário
    results = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.completed == True)).all()
    return [p.lesson_id for p in results]

# atualizar progresso put
@app.put("/progresso/{lesson_id}")
async def toggle_progress(lesson_id: int, current_user: Annotated[User, Depends(get_current_active_user)], session: Session = Depends(get_session)):
    prog = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.lesson_id == lesson_id)).first()
    
    if prog:
        prog.completed = not prog.completed
        msg = "Lição atualizada"
    else:
        prog = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id, completed=True)
        session.add(prog)
        msg = "Lição concluída"
    
    session.commit()
    return {"message": msg}

#rodar o server
if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
