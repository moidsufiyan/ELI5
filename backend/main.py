import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai
import httpx
import re
from dotenv import load_dotenv
from urllib.parse import quote

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

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
        safe_topic = quote(topic.strip().replace(' ', '_'))
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{safe_topic}"
        async with httpx.AsyncClient(timeout=10.0) as client_http:
            response = await client_http.get(url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "title": data.get("title"),
                    "summary": (data.get("extract", "") or "")[:500]
                }
    except Exception as e:
        print(f"Wikipedia error: {e}")
    return None

async def generate_with_gemini(prompt: str) -> str:
    """Safely call Gemini and return plain text or raise HTTPException."""
    if not GEMINI_API_KEY or client is None:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server")
    try:
        # Run blocking SDK in a thread to avoid blocking the event loop
        def _call():
            return client.models.generate_content(model="gemini-2.0-flash-exp", contents=prompt)
        response = await asyncio.to_thread(_call)
        text = getattr(response, 'text', None)
        if not text:
            # Some SDKs return candidates; fallback to best-effort
            try:
                candidates = getattr(response, 'candidates', [])
                text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text') if candidates else None
            except Exception:
                text = None
        if not text:
            raise HTTPException(status_code=502, detail="Gemini returned empty response")
        return text
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {str(e)}")

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
        
        # Build prompt based on complexity level
        level_prompts = {
            "ELI5": "Explain this like I'm 5 years old",
            "ELI15": "Explain this like I'm 15 years old", 
            "normal": "Provide a comprehensive adult-level explanation"
        }
        
        level_instruction = level_prompts.get(request.level, "Explain this")
        
        if wiki_info:
            prompt = f"""
Context from Wikipedia about "{wiki_info['title']}":
{wiki_info['summary']}

Now {level_instruction}: {request.text}

Use the Wikipedia information above to make your explanation more accurate.
Write in plain text without markdown formatting.
"""
        else:
            prompt = f"{level_instruction}: {request.text}. Write in plain text without markdown formatting."
        
        text = await generate_with_gemini(prompt)
        cleaned_text = clean_text(text)
        
        return {
            "simplified_text": cleaned_text,
            "used_wiki": wiki_info is not None,
            "wiki_title": wiki_info["title"] if wiki_info else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/simplify-stream")
async def simplify_text_stream(request: TextRequest):
    """Stream the simplified text response word by word"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long. Maximum 5000 characters")
        
        # Get Wikipedia context if requested
        wiki_info = None
        if request.use_wiki and request.topic:
            wiki_info = await get_wikipedia_summary(request.topic)
        
        # Build prompt based on complexity level
        level_prompts = {
            "ELI5": "Explain this like I'm 5 years old",
            "ELI15": "Explain this like I'm 15 years old", 
            "normal": "Provide a comprehensive adult-level explanation"
        }
        
        level_instruction = level_prompts.get(request.level, "Explain this")
        
        if wiki_info:
            prompt = f"""
Context from Wikipedia about "{wiki_info['title']}":
{wiki_info['summary']}

Now {level_instruction}: {request.text}

Use the Wikipedia information above to make your explanation more accurate.
Write in plain text without markdown formatting.
"""
        else:
            prompt = f"{level_instruction}: {request.text}. Write in plain text without markdown formatting."
        
        async def generate_stream():
            try:
                text = await generate_with_gemini(prompt)
                cleaned_text = clean_text(text)
                
                # Split text into words and stream them
                words = cleaned_text.split()
                
                # Send metadata first
                metadata = {
                    "type": "metadata",
                    "used_wiki": wiki_info is not None,
                    "wiki_title": wiki_info["title"] if wiki_info else None,
                    "total_words": len(words)
                }
                yield f"data: {json.dumps(metadata)}\n\n"
                
                # Stream words with delay to simulate typing
                current_text = ""
                for i, word in enumerate(words):
                    current_text += word + " "
                    
                    chunk = {
                        "type": "content",
                        "word": word,
                        "current_text": current_text.strip(),
                        "word_index": i,
                        "is_complete": i == len(words) - 1
                    }
                    
                    yield f"data: {json.dumps(chunk)}\n\n"
                    
                    # Add slight delay for typing effect
                    await asyncio.sleep(0.1)
                
                # Send completion signal
                completion = {
                    "type": "complete",
                    "final_text": current_text.strip()
                }
                yield f"data: {json.dumps(completion)}\n\n"
                
            except Exception as e:
                error_data = {
                    "type": "error",
                    "error": str(e)
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        )
        
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

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "backend": "Python FastAPI"}

# Static files removed - frontend runs as separate Next.js app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
