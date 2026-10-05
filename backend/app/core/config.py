import os

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Automated Lung Cancer Subtype Classification AI Platform")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_academic_capstone_key_2026_change_in_prod")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    
    # Database URL defaults to local SQLite database file, configurable to PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./lung_cancer_db.sqlite3")
    
    # Uploads & Artifact Directories
    UPLOAD_DIR: str = os.path.abspath("data/uploads")
    REPORTS_DIR: str = os.path.abspath("reports")
    WEIGHTS_DIR: str = os.path.abspath("ml/models/weights")

settings = Settings()
