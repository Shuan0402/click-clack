import os
import time
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = None

# 使用 Groq 
if api_key:
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )
else:
    print("⚠️ 警告: 未設定 API Key")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    mode: str = "creative" 
    length: str = "medium" # 👈 新增這個欄位 (short, medium, long)

@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    print(f"收到請求: Mode={request.mode}, Length={request.length}, Prompt={request.prompt}")
    
    # 1. 定義字數邏輯
    word_count_map = {
        "short": "around 100 words",
        "medium": "around 250 words",
        "long": "around 500 words"
    }
    target_len_str = word_count_map.get(request.length, "around 250 words")

    if client:
        try:
            # 2. 將字數要求塞入 System Prompt
            system_instruction = f"You are a creative writer. Generate a concise, engaging article ({target_len_str}) for typing practice. Do not output markdown titles, just plain text paragraphs."
            
            # 如果未來有其他模式 (extract/expand)，也可以在這裡調整 Prompt
            if request.mode == "extract":
                system_instruction = f"You are a summarizer. Extract key points from the user's text and form a coherent article ({target_len_str})."
            elif request.mode == "expand":
                system_instruction = f"You are a researcher. Take the user's topic and expand it into a detailed article ({target_len_str}) with external knowledge."

            print(f"呼叫 AI (Length: {target_len_str})...")
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": request.prompt}
                ],
                temperature=0.7,
            )
            return {
                "status": "success",
                "data": completion.choices[0].message.content
            }

        except Exception as e:
            print(f"API 呼叫失敗 ({str(e)})。切換至模擬模式。")
    
    # --- 降級模擬模式 (依照要求的長度給假資料) ---
    print("使用模擬資料回傳...")
    time.sleep(1)
    
    # 簡單模擬不同長度的假文
    base_text = "The quick brown fox jumps over the lazy dog. Technology moves fast. "
    multiplier = 5 if request.length == "short" else 15 if request.length == "medium" else 30
    
    fallback_text = f"[Mock Mode: {request.length.upper()} text]\n" + (base_text * multiplier)
    
    return {"status": "success", "data": fallback_text}

@app.get("/")
def read_root():
    return {"message": "ClickClack Backend is ready!"}