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

# --- 修改點 1: 設定 Groq 的 Base URL ---
if api_key:
    # 這裡的寫法讓原本的 OpenAI 套件去連 Groq 的伺服器
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

@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    print(f"收到請求: Mode={request.mode}, Prompt={request.prompt}")
    
    if client:
        try:
            print("正在呼叫 Groq API...") # 改個名字
            
            system_instruction = "You are a creative writer. Generate a concise, engaging article (200 words) for typing practice."
            
            completion = client.chat.completions.create(
                # --- 修改點 2: 模型名稱換成 Groq 支援的 ---
                # 推薦使用 Llama 3 (Meta) 或 Mixtral
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
    
    # --- 降級模擬模式 ---
    print("使用模擬資料回傳...")
    time.sleep(1)
    
    fallback_text = f"""[Mock Mode]
Backend is running but API call failed. 
Here is some practice text:
Technology moves fast. The quick brown fox jumps over the lazy dog.
    """
    return {"status": "success", "data": fallback_text}

@app.get("/")
def read_root():
    return {"message": "ClickClack Backend (Groq Edition) is ready!"}