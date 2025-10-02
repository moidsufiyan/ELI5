import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

# Import the router from simplify
from simplify import router as simplify_router

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router
app.include_router(simplify_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "ELI5 API is running"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Create handler for Vercel
handler = Mangum(app, lifespan="off")

# Vercel requires this exact function name
def vercel_handler(event, context):
    return handler(event, context)
