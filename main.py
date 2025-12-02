from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.responses import FileResponse

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are CRC AI, a helpful assistant."},
            {"role": "user", "content": request.message}
        ]
    )
    return {"assistant": "CRC AI", "reply": response.choices[0].message.content}

@app.get("/")
def home():
    return FileResponse("index.html")
