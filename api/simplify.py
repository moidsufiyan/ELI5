from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from typing import Optional
import google.generativeai as genai

router = APIRouter(prefix="/api", tags=["simplify"])

class SimplificationRequest(BaseModel):
    text: str
    complexity: str = "ELI5"
    use_wikipedia: bool = False
    wikipedia_topic: Optional[str] = None

@router.post("/simplify")
async def simplify_text(request: SimplificationRequest):
    try:
        # Configure Gemini AI
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt
        prompt = f"Explain this in {request.complexity} level: {request.text}"
        
        if request.use_wikipedia and request.wikipedia_topic:
            # Add Wikipedia integration logic here
            prompt += f"\n\nAdditional context from Wikipedia about {request.wikipedia_topic}:"
            # You would add Wikipedia API calls here
            
        # Generate response
        response = model.generate_content(prompt)
        
        return {
            "simplified_text": response.text,
            "complexity_level": request.complexity,
            "original_length": len(request.text),
            "simplified_length": len(response.text)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
