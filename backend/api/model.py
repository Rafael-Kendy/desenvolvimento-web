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

#tabela de users
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr = Field(index=True, unique=True)#index=True acelera a busca, unique=True impede emails repetidos
    hashed_password: str
    description: Optional[str] = "Salve, novo usuario criado"
    is_premium: bool = Field(default=False)
