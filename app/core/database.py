import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Oracle connection defaults (should be overwritten by env vars)
    ORACLE_USER: str = "SYSTEM"
    ORACLE_PASS: str = "password"
    ORACLE_HOST: str = "localhost"
    ORACLE_PORT: str = "1521"
    ORACLE_SERVICE: str = "xe"
    
    @property
    def database_url(self) -> str:
        # Use SQLite for local development/testing if Oracle host is 'localhost' (default)
        if self.ORACLE_HOST == "localhost" and not os.getenv("ORACLE_HOST"):
            return "sqlite:///./factory_integrity.db"
        
        # Using python-oracledb driver for target Oracle environment
        return f"oracle+oracledb://{self.ORACLE_USER}:{self.ORACLE_PASS}@{self.ORACLE_HOST}:{self.ORACLE_PORT}/?service_name={self.ORACLE_SERVICE}"

settings = Settings()

# Create SQLAlchemy engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    # oracledb specific: thicker pooling if needed
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
