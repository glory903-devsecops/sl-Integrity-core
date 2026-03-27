# SL Factory Integrity Platform (SDF-IP)

## 🏢 Overview
This platform is designed for the **Factory Innovation Team at SL**, targeting the implementation of **Software Defined Factory (SDF)**. It provides a robust, enterprise-grade solution for ensuring the integrity and consistency of software, configuration, and logistics data across distributed factory nodes.

## 🚀 Key Features
- **Directory-Based Integrity Checking**: Leverages `dirhash` for high-performance hashing of large directory trees (SDF assets, machine configs).
- **Baseline Management**: Establish "gold standards" for factory software and detect unauthorized drift or corruption.
- **Enterprise Persistence**: Integrated with **Oracle** (via SQLAlchemy 2.0 & python-oracledb) for secure audit logging.
- **Asynchronous Scanning**: FastAPI-based background tasks to perform large-scale integrity checks without blocking production operations.
- **Logistics Integration (SD/MM)**: Ensures that data packages moving through the logistics chain remain untampered.

## 🛠 Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: Oracle
- **Integrity Multi-tool**: `dirhash`
- **ORM**: SQLAlchemy 2.0 (Modern Mapped Syntax)

## 📂 Project Structure
- `app/core/`: Database and Hashing logic.
- `app/models.py`: SQLAlchemy models for audit trails.
- `app/schemas.py`: Pydantic models for API safety.
- `app/main.py`: REST API endpoints.

## 🚦 Getting Started
1. Install dependencies: `pip install -r requirements.txt`
2. Set Environment Variables:
   - `ORACLE_USER`, `ORACLE_PASS`, `ORACLE_HOST`, `ORACLE_SERVICE`
3. Run Server: `uvicorn app.main:app --reload`
4. Access API Docs: `http://localhost:8000/docs`
