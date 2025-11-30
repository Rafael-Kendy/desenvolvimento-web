from sqlmodel import SQLModel, Field
from typing import Optional
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
