from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from .db import session, models
from .api import endpoints

# Initialize FastAPI
app = FastAPI(
    title="SL Integrity-Core",
    description="에스엘(SL) 스마트 팩토리 무결성 관제 플랫폼 (SDF)",
    version="3.0.0"
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if they don't exist
models.Base.metadata.create_all(bind=session.engine)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Root redirect to UI
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/static/index.html")

# Include API Router
app.include_router(endpoints.router, prefix="/api", tags=["Integrity"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
