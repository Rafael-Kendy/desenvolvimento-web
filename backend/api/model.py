from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr

class Question(SQLModel, table=True):  #table=true pra falar que e uma tabela db real
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    title: str
    question: str
    image_url: Optional[str] = None

#tabela de users, modelagem do bd
#ORM é o sqlmodel, permite usar objetos de python normal e dps traduz pro sql, uma busca de usuario se traduziria em select
class User(SQLModel, table=True):#true diz q eh uma tabela real
    id: Optional[int] = Field(default=None, primary_key=True)#primary_key=true pra dizer que o bd eh o responsavel por gerar o id
    name: str
    email: EmailStr = Field(index=True, unique=True)#index=True acelera a busca, unique=True impede emails repetidos
    hashed_password: str
    description: Optional[str] = "Salve, novo usuario criado"
    is_premium: bool = Field(default=False)
    progress: List["UserLessonProgress"] = Relationship(back_populates="user")

class Course(SQLModel, table=True): # curso na db!
    id: Optional[int] = Field(default=None, primary_key=True) # id automático
    title: str
    description: str
    image: str # tipo "internet.png" 
    sections: List["Section"] = Relationship(back_populates="course")

class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    course_id: int = Field(foreign_key="course.id")
    
    course: Course = Relationship(back_populates="sections")
    lessons: List["Lesson"] = Relationship(back_populates="section")

class Lesson(SQLModel, table=True): # onde ficam os conteúdos
    id: int = Field(primary_key=True) # ID manual igual os passos anteriores
    title: str
    video_url: Optional[str] = None
    section_id: int = Field(foreign_key="section.id")
    header_image_url: Optional[str] = None
    section: Section = Relationship(back_populates="lessons")
    steps: List["Step"] = Relationship(back_populates="lesson")
    
    # Relacionamento reverso do progresso, para saber quais usuários completaram a lição
    user_progress: List["UserLessonProgress"] = Relationship(back_populates="lesson")

# passo a passo de cada página de lição
class Step(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    lesson_id: int = Field(foreign_key="lesson.id")
    
    lesson: Lesson = Relationship(back_populates="steps")

# tabela de progresso 1:n
class UserLessonProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    lesson_id: int = Field(foreign_key="lesson.id")
    completed: bool = Field(default=True)

    user: User = Relationship(back_populates="progress")
    lesson: Lesson = Relationship(back_populates="user_progress")