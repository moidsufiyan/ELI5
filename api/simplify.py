"""Simplify text API endpoint for Vercel serverless"""
import json
import asyncio
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api._utils import get_gemini_client, clean_text, get_wikipedia_summary, build_prompt

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # Validate input
            text = request_data.get('text', '').strip()
            if not text:
                self.wfile.write(json.dumps({
                    "detail": "Text cannot be empty"
                }).encode())
                return

            if len(text) > 5000:
                self.wfile.write(json.dumps({
                    "detail": "Text too long. Maximum 5000 characters"
                }).encode())
                return

            # Get parameters
            level = request_data.get('level', 'ELI5')
            use_wiki = request_data.get('use_wiki', True)
            topic = request_data.get('topic', '')

            # Process request
            result = asyncio.run(self._process_request(text, level, use_wiki, topic))
            
            # Send response
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "detail": f"Error: {str(e)}"
            }).encode())

    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    async def _process_request(self, text, level, use_wiki, topic):
        """Process the simplification request"""
        # Get Wikipedia context if requested
        wiki_info = None
        if use_wiki and topic:
            wiki_info = await get_wikipedia_summary(topic)

        # Build prompt
        prompt = build_prompt(text, level, wiki_info)

        # Get Gemini client and generate content
        client = get_gemini_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp", 
            contents=prompt
        )

        # Clean and return result
        cleaned_text = clean_text(response.text)

        return {
            "simplified_text": cleaned_text,
            "used_wiki": wiki_info is not None,
            "wiki_title": wiki_info["title"] if wiki_info else None
        }
