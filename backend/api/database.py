from sqlmodel import SQLModel, create_engine, Session

#url do sqlite
DATABASE_URL = "sqlite:///./comunidade.db"

engine = create_engine(DATABASE_URL, echo=True) #echo=true pra printar as query, debug

def get_session():
    with Session(engine) as session:
        yield session