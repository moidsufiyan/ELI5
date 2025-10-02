from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import APIRouter
import json
import os

# Import router directly since we're not using relative imports
from simplify import router as simplify_router

app = FastAPI(
    title="ELI5 API",
    description="API for simplifying complex text using AI",
    version="1.0.0"
)

# Include routers
app.include_router(simplify_router)

# Add CORS middleware for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://eli5-alpha.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {
        "message": "ELI5 API is running!",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ELI5 AI Simplifier",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

# For Vercel serverless compatibility
# This is a simplified handler that will work with Vercel
async def handler(request: Request):
    path = request.url.path
    if path == "/":
        return JSONResponse(content={"message": "ELI5 API is running!"})
    elif path == "/api/health":
        return JSONResponse(content={"status": "healthy"})
    else:
        return JSONResponse(
            content={"error": "Not Found"},
            status_code=404
        )
