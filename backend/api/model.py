from sqlmodel import SQLModel, Field
from typing import Optional

class Question(SQLModel, table=True):  #table=true pra falar que e uma tabela db real
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    title: str
    question: str
    image_url: Optional[str] = None