from http.server import BaseHTTPRequestHandler
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from typing import Optional

# Your existing AI logic here
import google.generativeai as genai

app = FastAPI()

class SimplificationRequest(BaseModel):
    text: str
    complexity: str = "ELI5"
    use_wikipedia: bool = False
    wikipedia_topic: Optional[str] = None

@app.post("/api/simplify")
async def simplify_text(request: SimplificationRequest):
    try:
        # Configure Gemini AI
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')
        
        # Your existing simplification logic
        prompt = f"Explain this in {request.complexity} level: {request.text}"
        
        if request.use_wikipedia and request.wikipedia_topic:
            # Add Wikipedia integration logic
            pass
            
        response = model.generate_content(prompt)
        
        return {
            "simplified_text": response.text,
            "complexity_level": request.complexity,
            "original_length": len(request.text),
            "simplified_length": len(response.text)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless handler
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            # Process the request using your FastAPI logic
            # Return JSON response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # Your processing logic here
            result = {"status": "success", "message": "Text simplified"}
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())
