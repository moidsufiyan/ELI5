"""Streaming simplify text API endpoint for Vercel serverless"""
import json
import asyncio
import time
from http.server import BaseHTTPRequestHandler
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api._utils import get_gemini_client, clean_text, get_wikipedia_summary, build_prompt

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # Validate input
            text = request_data.get('text', '').strip()
            if not text:
                self.send_error(400, "Text cannot be empty")
                return

            if len(text) > 5000:
                self.send_error(400, "Text too long. Maximum 5000 characters")
                return

            # Get parameters
            level = request_data.get('level', 'ELI5')
            use_wiki = request_data.get('use_wiki', True)
            topic = request_data.get('topic', '')

            # Set headers for streaming
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            # Process and stream response
            asyncio.run(self._stream_response(text, level, use_wiki, topic))

        except Exception as e:
            error_data = {
                "type": "error",
                "error": str(e)
            }
            self.wfile.write(f"data: {json.dumps(error_data)}\n\n".encode())

    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    async def _stream_response(self, text, level, use_wiki, topic):
        """Process and stream the simplification response"""
        try:
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

            # Clean text
            cleaned_text = clean_text(response.text)
            words = cleaned_text.split()

            # Send metadata first
            metadata = {
                "type": "metadata",
                "used_wiki": wiki_info is not None,
                "wiki_title": wiki_info["title"] if wiki_info else None,
                "total_words": len(words)
            }
            self.wfile.write(f"data: {json.dumps(metadata)}\n\n".encode())
            self.wfile.flush()

            # Stream words with delay
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
                
                self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode())
                self.wfile.flush()
                
                # Add slight delay for typing effect
                await asyncio.sleep(0.05)

            # Send completion signal
            completion = {
                "type": "complete",
                "final_text": current_text.strip()
            }
            self.wfile.write(f"data: {json.dumps(completion)}\n\n".encode())
            self.wfile.flush()

        except Exception as e:
            error_data = {
                "type": "error",
                "error": str(e)
            }
            self.wfile.write(f"data: {json.dumps(error_data)}\n\n".encode())
            self.wfile.flush()
