from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Create router with API prefix
router = APIRouter(prefix="/api", tags=["simplify"])

class SimplificationRequest(BaseModel):
    text: str
    complexity: str = "ELI5"
    use_wikipedia: bool = False
    wikipedia_topic: Optional[str] = None

@router.post("/simplify")
async def simplify_text(request: SimplificationRequest):
    try:
        # Get API key from environment
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY is not configured in environment variables"
            )
        
        # Configure and initialize the model
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Build the prompt
        prompt = f"Explain the following in {request.complexity} terms: {request.text}"
        
        if request.use_wikipedia and request.wikipedia_topic:
            prompt += f"\n\nInclude relevant information from Wikipedia about {request.wikipedia_topic} if helpful."
        
        try:
            # Generate the response
            response = model.generate_content(prompt)
            
            return {
                "status": "success",
                "data": {
                    "original_text": request.text,
                    "simplified_text": response.text,
                    "complexity_level": request.complexity,
                    "original_length": len(request.text),
                    "simplified_length": len(response.text)
                }
            }
            
        except Exception as genai_error:
            raise HTTPException(
                status_code=500,
                detail=f"Error generating response: {str(genai_error)}"
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
        
    except Exception as e:
        # Catch any other exceptions
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
