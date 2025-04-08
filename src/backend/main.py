from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import os


load_dotenv()

app = FastAPI()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/ai")
def summarize(text: str):
    
    response = client.models.generate_content(model="gemini-2.0-flash-001", contents=f'You are a helpful assistant that only summarizes books and articles. You do not answer questions unrelated to summarization.  If a request is outside this scope, politely decline and redirect the user to ask for a summary. {text}', config={
        "temperature": 0.3,
        "top_k": 20,
        "max_output_tokens": 512
    })
    return {
        "message": response.text
    }
