import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Credenciales
DB_USER = os.getenv("DB_USER", "u659323332_sex")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Quibdo123*")
DB_HOST = os.getenv("DB_HOST", "82.197.82.29")
DB_NAME = os.getenv("DB_NAME", "u659323332_sex")

# La URL de conexión está perfecta
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la DB en las rutas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()