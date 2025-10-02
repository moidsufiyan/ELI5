import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai
import httpx
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://eli5-alpha.vercel.app",  # Production frontend
        "http://localhost:5173",          # Local development
        "http://127.0.0.1:5173"           # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

client = genai.Client(api_key=GEMINI_API_KEY)

class TextRequest(BaseModel):
    text: str
    level: str = "ELI5"
    use_wiki: bool = True
    topic: str = ""

def clean_text(text: str) -> str:
    """Remove markdown formatting from text"""
    text = text.replace('**', '').replace('__', '')
    text = text.replace('*', '')
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

async def get_wikipedia_summary(topic: str):
    """Get summary from Wikipedia"""
    if not topic:
        return None
    
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}"
        async with httpx.AsyncClient() as client_http:
            response = await client_http.get(url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "title": data.get("title"),
                    "summary": data.get("extract", "")[:500]
                }
    except Exception as e:
        print(f"Wikipedia error: {e}")
    return None

@app.post("/api/simplify")
async def simplify_text(request: TextRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long. Maximum 5000 characters")
        
        # Get Wikipedia context if requested
        wiki_info = None
        if request.use_wiki and request.topic:
            wiki_info = await get_wikipedia_summary(request.topic)
        
        # Build prompt
        if wiki_info:
            prompt = f"""
Context from Wikipedia about "{wiki_info['title']}":
{wiki_info['summary']}

Now explain this for {request.level}: {request.text}

Use the Wikipedia information above to make your explanation more accurate.
Write in plain text without markdown formatting.
"""
        else:
            prompt = f"Explain this for {request.level}: {request.text}. Write in plain text without markdown formatting."
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        
        cleaned_text = clean_text(response.text)
        
        return {
            "simplified_text": cleaned_text,
            "used_wiki": wiki_info is not None,
            "wiki_title": wiki_info["title"] if wiki_info else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/api/wiki/{topic}")
async def test_wiki(topic: str):
    result = await get_wikipedia_summary(topic)
    return result or {"error": "Topic not found"}

@app.get("/")
def home():
    return {"message": "ELI5 Simplifier is working!"}

# Serve static files (for production)
try:
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
except Exception:
    pass  # In development, frontend runs separately

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
