"""Shared utility functions for API routes"""
import os
import re
import httpx
from google import genai

# Initialize Gemini client
def get_gemini_client():
    """Initialize and return Gemini client"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    return genai.Client(api_key=api_key)

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
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "title": data.get("title"),
                    "summary": data.get("extract", "")[:500]
                }
    except Exception as e:
        print(f"Wikipedia error: {e}")
    return None

def get_level_prompts():
    """Return level-specific prompts"""
    return {
        "ELI5": "Explain this like I'm 5 years old",
        "ELI15": "Explain this like I'm 15 years old", 
        "normal": "Provide a comprehensive adult-level explanation"
    }

def build_prompt(text: str, level: str, wiki_info=None):
    """Build prompt based on complexity level and wiki info"""
    level_prompts = get_level_prompts()
    level_instruction = level_prompts.get(level, "Explain this")
    
    if wiki_info:
        return f"""
Context from Wikipedia about "{wiki_info['title']}":
{wiki_info['summary']}

Now {level_instruction}: {text}

Use the Wikipedia information above to make your explanation more accurate.
Write in plain text without markdown formatting.
"""
    else:
        return f"{level_instruction}: {text}. Write in plain text without markdown formatting."
