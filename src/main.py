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

model = genai.GenerativeModel("gemini-2.0-flash-001", generation_config={
        "temperature": 0.2,
        "top_k": 40,
        "max_output_tokens": 1024
    }, system_instruction="""    You are an expert summarization system specialized in condensing books and articles while preserving key information.
    
    SUMMARIZATION INSTRUCTIONS:
    1. Identify and prioritize the main themes, arguments, and conclusions
    2. Preserve essential details, examples, and supporting evidence
    3. Maintain the author's original meaning and intent
    4. Use clear, concise language without unnecessary words
    5. Follow a logical flow that connects ideas coherently
    6. If the input is general, respond in a general way, like a greeting.""")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/ai")
def summarize(text: str):
    prompt = (
       f'''{text}
    '''
    )
    
    response = model.generate_content(prompt, )

    return {"message": response.text}
