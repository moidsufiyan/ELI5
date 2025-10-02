from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum
from .index import app

# Create handler for Vercel
handler = Mangum(app, lifespan="off")

# This is needed for Vercel to recognize the function
# The filename (vercel_handler.py) will be used as the function name in Vercel
# So this will be available at /api/vercel_handler
def vercel_handler(event, context):
    return handler(event, context)
