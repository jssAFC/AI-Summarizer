from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = genai.GenerativeModel("gemini-2.0-flash-001")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/ai")
def summarize(text: str):
    prompt = (
        "You are a helpful assistant that only summarizes books and articles. "
        "You do not answer questions unrelated to summarization. "
        "If a request is outside this scope, politely decline and redirect the user to ask for a summary. "
        f"{text}"
    )
    
    response = model.generate_content(prompt, generation_config={
        "temperature": 0.3,
        "top_k": 20,
        "max_output_tokens": 512
    })

    return {"message": response.text}
