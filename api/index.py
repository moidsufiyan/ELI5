from http.server import BaseHTTPRequestHandler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Add CORS middleware for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://eli5-alpha.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ELI5 API is running!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ELI5 AI Simplifier"}

# For Vercel serverless compatibility
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "ELI5 API is running!"}
        self.wfile.write(json.dumps(response).encode())
