"""Wikipedia lookup API endpoint for Vercel serverless"""
import json
import asyncio
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api._utils import get_wikipedia_summary

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse URL to get topic parameter
            parsed_path = urlparse(self.path)
            topic = parsed_path.path.split('/')[-1]  # Get last part of path

            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.end_headers()

            # Get Wikipedia summary
            result = asyncio.run(get_wikipedia_summary(topic))
            
            if result:
                self.wfile.write(json.dumps(result).encode())
            else:
                self.wfile.write(json.dumps({"error": "Topic not found"}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": f"Error: {str(e)}"
            }).encode())

    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
