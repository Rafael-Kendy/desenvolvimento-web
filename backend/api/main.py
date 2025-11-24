import uvicorn #pra rodar, uvicorn api.main:app --reload
from fastapi import FastAPI, UploadFile, Form, File, Body
from fastapi.middleware.cors import CORSMiddleware #liga front e back
from pydantic import BaseModel #pros tipos das coisas
from typing import List, Optional, Dict
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
import hashlib #p/ usar o gravatar
import httpx # p usar o unsplash

#coisa pro bd
from sqlmodel import SQLModel, Session, select
from .database import engine, get_session
from .model import Question, User



app = FastAPI() #objeto base pra cuidar dos endpoint
print("\nDebug: Server iniciou\n")

origins = [
    "http://localhost:5173", #front
    "http://localhost:8000" #back
    "https://chave-digital.onrender.com/" #back hosteado no render
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
#parte do banco de dados

@app.on_event("startup") #cria as tabelas no inicio
def on_startup():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

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

#liçoes
class Lesson(BaseModel):
    # define um subtópico (lição)
    id: int
    label: str # "tipo 'O que é a internet'"
    href: str  # por exemplo "/licoes/internet/licao1" (link p pag da lição em si)
# liçoes

#put curso
class NewCourse(BaseModel):
    title: str
    description: str
    image: str # ex: "hardware.png"
#put curso

#seçoes
class Section(BaseModel):
    # seçao (a lista de assuntos) que contem as liçoes
    title: str
    items: List[Lesson]
#seçoes

#cursos
class Course(BaseModel): # modelo do curso
    id: int
    title: str
    description: str | None = None
    sections: List[Section] # lista de seções com os assuntos
    is_free: bool = True
    image: str
#cursos

#classes pras checkbox
class ProgressUpdate(BaseModel):
    #o que o front coloca no PUT
    completado: bool

class UserProgress(BaseModel):
    # como será colocado no "bando de dados"
    user_email: EmailStr
    lesson_id: int
#classes pras checkbox

# bando de dados na memória p salvar o progresso da checkbox
user_progress = []

#classes para o conteúdo das lições
class Step(BaseModel):
    # passo na lição
    text: str
    # por enquanto só texto, mas uma ideia: image_url: Optional[str] = None

class NextLessonInfo(BaseModel):
    id: int
    title: str # título da próxima lição

class LessonContent(BaseModel):# o conteúdo da lição
    lesson_id: int
    title: str 
    header_image_url: Optional[str] = None
    steps: List[Step] # lista de passos (Step criado acima)
    video_url: Optional[str] = None # link pro video se tiver algum na lição
    next_lessons: List[NextLessonInfo] = [] # lista com as próximas lições
#classes para o conteúdo das lições

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
async def get_current_active_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    # o depends() faz a fastAPI pegar o token do cabeçalho e mandar ele p/ variavel token
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
    
    #busca no sql, seleciona o usuario onde o email é igual ao email do token
    statement = select(User).where(User.email == email)
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
    
    #verifica no bd se o email existe
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Esse email já existe") 


    hashed_password = pwd_context.hash(user_data.password)#criptografa a senha

    new_user = User( #cria um novo usuário
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password, #salva a versao criptografada
        description="AAAAAAAA",
        is_premium=False
    )

    #salva no bd
    session.add(new_user)
    session.commit()
    session.refresh(new_user) #atualiza o new_user com o id gerado pelo bd
    
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

    #busca no bd o email
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
    
    #pega o email do usuario e formata com letras minusculas e sem espaço
    email_address = current_user.email.lower().strip()
    
    # cria o hash MD5 do email, requisito do gravatar
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

    #atualiza os campos se o frontend enviou um name q nao eh nulo
    if user_update.name is not None:
        current_user.name = user_update.name#atualiza o nome
    
    #atualiza os campos se o frontend enviou uma descrição q nao eh nula
    if user_update.description is not None:
        current_user.description = user_update.description#atualiza a descrição
        
    session.add(current_user) #marca para atualização
    session.commit() #salva no bd
    session.refresh(current_user) #pega os dados atualizados
    
    #retorna o usuário com os dados atualizados, o response_model=UserPublic garante que a senha hash não vaze
    return user_to_public(current_user)
#endpoint perfil PUT

#cursos -----------------------------------------------------------------------------------

# função pra ajudar a achar "próxima lição"
def find_next_lessons_in_course(current_lesson_id: int) -> List[NextLessonInfo]:
    found_course = None
    
    # acha a qual curso a lição atual pertence
    for course in courses:
        for section in course.sections:
            for lesson in section.items:
                if lesson.id == current_lesson_id:
                    found_course = course
                    break
            if found_course: break
        if found_course: break
    
    # se a lição não foi encontrada em nenhum curso
    if not found_course:
        return [] 

    # cria uma lista "plana" de todas as lições APENAS desse curso
    course_lessons_flat: List[Lesson] = []
    for section in found_course.sections:
        course_lessons_flat.extend(section.items) # .items é List[Lesson]

    # acha a próxima lição na lista
    for i, lesson in enumerate(course_lessons_flat):
        if lesson.id == current_lesson_id:
            # achamos a lição atual em 'i'
            if i + 1 < len(course_lessons_flat):
                # se existe uma próxima lição -> (índice i+1)
                next_lesson = course_lessons_flat[i + 1]
                
                # retorna a próxima lição no formato que o frontend quer
                return [NextLessonInfo(id=next_lesson.id, title=next_lesson.label)] 
            else:
                # se for a última lição do curso
                return [] 
    
    return [] # n achou a lição na lista (vai que)

#cursos na memória, igual users e questions. No futuro, virão do banco de dados, mas como ele NÃO EXISTE, estão hardcoded aqui.
courses = [
    Course(
        id=1,
        title="Internet",
        description="Aprenda o que é internet e como navegar.",
        is_free=True, # Este curso é gratuito
        image="internet.png",
        sections=[
            Section(title="Conceitos Básicos", items=[
                Lesson(id=101, label="O que é a Internet", href="/licoes/101"),
                Lesson(id=102, label="Navegadores", href=f"/licoes/102"),
                Lesson(id=103, label="Sites e links", href=f"/licoes/103"),
            ]),
            Section(title="Segurança", items=[
                Lesson(id=104, label="Segurança básica", href="/licoes/104")
            ])
        ]
    ),
    Course(
        id=2,
        title="Computadores",
        description="Aprenda a usar um computador.",
        is_free=True,
        image="computer-desktop.png",
        sections=[
            Section(title="Componentes", items=[
                Lesson(id=201, label="Mouse e Teclado", href=f"/licoes/{201}"),
                Lesson(id=202, label="Monitor", href=f"/licoes/{202}"),
            ])
        ]
    ),
    Course(
        id=3,
        title="Chamadas (PREMIUM)",
        description="Conversando com alguém longe de você.",
        is_free=False, # CURSO PREMIUM!
        image="phone-call.png",
        sections=[
            Section(title="WhatsApp", items=[
                Lesson(id=301, label="Chamada de Vídeo", href=f"/licoes/{301}"),
            ])
        ]
    )
]

#endpoint cursos GET
@app.get("/cursos", response_model=list[Course])
async def listar_cursos(current_user: Annotated[User, Depends(get_current_active_user)]): #só usuarios logados podem ver os cursos!
    return courses
#endpoint cursos GET

#endpoint cursos especificos GET
@app.get("/cursos/{course_id}", response_model=Course) # 1. MUDANÇA: Revertido para 'Course'
async def get_one_course(course_id: int, current_user: Annotated[User, Depends(get_current_active_user)]):
  
    # verificação de achar ou não achar o curso
    found_course = None
    for course in courses:
        if course.id == course_id:
            found_course = course # pro retorno!
            break
    if not found_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    # a parte daqui é de autorização.
    # pra fazer a implementação de ambos, foi criado um tipo de conta "premium"
    # se o curso for de graça, logados acessam.
    # se não estiver logado, nem entra (pelo current_user: annotated bla bla bla)
    # se o curso for premium, os de graça não acessam (MARX, 1867)
    if not found_course.is_free and not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esse curso requer assinatura premium."
        )

    return found_course
#endpoint cursos especificos GET


#endpoint de checkbox GET
@app.get("/progresso/curso/{course_id}", response_model=List[int])
async def get_progresso_do_curso(
    course_id: int, # O ID do curso caso precise
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # retorna uma lista de ID das lições q o user de agora completou
    
    completed_lessons_ids = []
    for progresso in user_progress:
        if progresso.user_email == current_user.email:
            # melhorar no futuro: verificar se a lição pertence ao course_id
            completed_lessons_ids.append(progresso.lesson_id)

    print(f"Enviando progresso para {current_user.email}: {completed_lessons_ids}")

    return completed_lessons_ids
#endpoint de checkbox GET

#endpoint de salvar progresso da checkbox PUT
@app.put("/progresso/licao/{lesson_id}")
async def salvar_progresso( # a async marca ou tira o progresso de uma lição pro user logado
    lesson_id: int, # id da licao
    update_data: ProgressUpdate, # { "completado": true/false } do front
    current_user: Annotated[User, Depends(get_current_active_user)] # ql user ta salvando?
):
    # verifica o que o user quer fazer
    if update_data.completado:
        # checkbox marcada
        # ve se ja ta salvo, p nao duplicar
        ja_existe = False
        for progresso in user_progress:
            if progresso.user_email == current_user.email and progresso.lesson_id == lesson_id:
                ja_existe = True
                break
        
        #se nao existe...
        if not ja_existe:
            user_progress.append(UserProgress(user_email=current_user.email,lesson_id=lesson_id))
            # printnado p ver no console do backend!
            print(f"Progresso salvo: user {current_user.email} completou lição {lesson_id}")
            print(f"BD de progresso atual: {user_progress}")
            
    else:
        # checkbox desmarcada
        # procura o progresso na lista p remover
        progresso_para_remover = None
        for progresso in user_progress:
            if progresso.user_email == current_user.email and progresso.lesson_id == lesson_id:
                progresso_para_remover = progresso
                break
        # SE existe algum progresso p ser removido
        if progresso_para_remover:
            user_progress.remove(progresso_para_remover)
            print(f"Progresso removido: user {current_user.email} desmarcou lição {lesson_id}")
            print(f"BD de progresso atual: {user_progress}")

    return {"status": "sucesso", "progresso_atual": user_progress}
#endpoint de salvar progresso da checkbox PUT

# o "BD" que salva o conteúdo das lições, na memória
# mapeia o ID da lição(int) pro conteúdo
lesson_contents: Dict[int, LessonContent] = {
    101: LessonContent(
        lesson_id=101,
        title="O que é a Internet",
        steps=[
            Step(text="A internet é tipo"),
            Step(text="Ela meio que"),
            Step(text="Pensa assim")
        ],
        video_url="/videos/o-que-e-internet.mp4" #caminho do video
    ),
    102: LessonContent(
        lesson_id=102,
        title="Navegadores",
        steps=[
            Step(text="placeholder"),
            Step(text="placeholder"),
            Step(text="placeholder")
        ],
        # exemplo de lição sem vídeo
    ),
    # caminho pra outras lições
    103: LessonContent(lesson_id=104, title="Segurança Básica", steps=[Step(text="placeholder")]),
    104: LessonContent(lesson_id=104, title="Segurança Básica", steps=[Step(text="placeholder")]),
    201: LessonContent(lesson_id=201, title="Mouse e Teclado", steps=[Step(text="placeholder")]),
    202: LessonContent(lesson_id=202, title="Monitor", steps=[Step(text="placeholder")]),
    301: LessonContent(lesson_id=301, title="Chamada de Vídeo", steps=[Step(text="placeholder")], video_url="/videos/chamada.mp4"),
}

#endpoint GET lesson content
@app.get("/licoes/{lesson_id}", response_model=LessonContent)
async def get_lesson_content(lesson_id: int,current_user: Annotated[User, Depends(get_current_active_user)]):

    content = lesson_contents.get(lesson_id) #pega o id da lição e coloca em content

    if not content:# se não for encontrada
        raise HTTPException(status_code=404, detail="Conteúdo da lição não encontrado")
    
    if lesson_id == 301 and not current_user.is_premium: # estatico por enquanto, 
        raise HTTPException(status_code=403, detail="Esta lição é premium.")

    # INTEGRAÇÃO COM API EXTERNA 
    UNSPLASH_API_KEY = "chave_da_api" # colocando manualmente por enquanto
    query = content.title # usa o titulo da lição como busca

    try:
        # 'async with' faz a chamada de forma assíncrona
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Client-ID {UNSPLASH_API_KEY}"}
            params = {"query": query, "per_page": 1, "orientation": "landscape"}

            # chama a API do Unsplash
            response = await client.get("https://api.unsplash.com/search/photos", headers=headers, params=params)
            response.raise_for_status() # Lança um erro se a requisição falhar

            data = response.json()
            if data["results"]:
                # pega a URL da imagem e a adiciona ao objeto 'content'
                image_url = data["results"][0]["urls"]["regular"]
                content.header_image_url = image_url
    #exceção            
    except Exception as e:
        print(f"Erro ao buscar imagem no Unsplash: {e}")
        content.header_image_url = None # falha mas a lição continua rodando
    # FIM DA INTEGRAÇÃO C API EXTERNA

    #acha a próxima lição dinamicamente
    next_lessons_list = find_next_lessons_in_course(lesson_id)

    # add a lista ao objeto de conteúdo antes de retornar
    # aparentemente Pydantic V2 permite essa atribuição direta? sei lá
    content.next_lessons = next_lessons_list

    return content
#endpoint GET lesson content

#endpoint novo curso POST
@app.post("/cursos", response_model=Course) #axios.post()
# esse endpoint é parte do trabalho, mas não estamos permitindo usuários premium no momento
async def create_new_course(
    new_course: NewCourse,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # só usuários "premium" (admin, por enquanto, se precisar) podem criar cursos
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem criar cursos."
        )

    # achar o maior ID existente e somar 1, já que os cursos existentes estão em lista
    new_id = max(course.id for course in courses) + 1
    
    course_obj = Course(# parâmetros para um novo curso
        id=new_id,
        title=new_course.title,
        description=new_course.description,
        image=new_course.image,
        sections=[]  # começa sem seções
    )
    
    # salva na "memória" (append em courses)
    courses.append(course_obj)
    
    # retorna o que acabou de criar
    return course_obj
#endpoint novo curso POST

#endpoint DELETE curso
@app.delete("/licoes/{licao_id}", status_code=status.HTTP_200_OK) #axios.delete()
# esse endpoint é parte do trabalho, mas não estamos permitindo usuários premium no momento
async def delete_lesson(
    licao_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # 1. Autenticação (de novo)
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem remover lições."
        )

    # lógica de remoção:
    
    # remover de "conteúdos"
    if licao_id in lesson_contents:
        del lesson_contents[licao_id]
    else:
        raise HTTPException(status_code=404, detail="Conteúdo da lição não encontrado para deletar.")

    # remover da lista de "Cursos" p/ não aparecer no menu
    found = False
    for course in courses:
        for section in course.sections:
            for i, lesson in enumerate(section.items):
                if lesson.id == licao_id:
                    section.items.pop(i) # remove a lição da lista
                    found = True
                    break
            if found: break
        if found: break

    if not found:
        raise HTTPException(status_code=404, detail="Lição não encontrada na estrutura do curso.")

    return {"detail": f"Lição {licao_id} removida com sucesso."}
#endpoint DELETE cursos

#rodar o server
if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
