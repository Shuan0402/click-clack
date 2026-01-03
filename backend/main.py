import os
import time
import io
import math
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import pypdf
from pptx import Presentation

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
    length: str = "medium"

# --- 輔助函式 1: 解析檔案 ---
async def extract_text_from_file(file: UploadFile) -> str:
    content = ""
    filename = file.filename.lower()
    file_bytes = await file.read()
    file_stream = io.BytesIO(file_bytes)

    try:
        if filename.endswith(".txt"):
            content = file_bytes.decode("utf-8")
        elif filename.endswith(".pdf"):
            pdf_reader = pypdf.PdfReader(file_stream)
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text: content += text + "\n"
        elif filename.endswith(".pptx"):
            prs = Presentation(file_stream)
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        content += shape.text + "\n"
    except Exception as e:
        print(f"解析失敗: {e}")
        return ""
    return content.strip()

# --- [核心新功能] 輔助函式 2: 分段摘要邏輯 ---
def chunk_text(text, chunk_size=4000):
    """將文字切成固定大小的區塊"""
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def get_target_length_desc(length_code):
    word_count_map = {
        "short": "around 100 words",
        "medium": "around 250 words",
        "long": "around 500 words"
    }
    return word_count_map.get(length_code, "around 250 words")

# --- API 1: 純文字生成 ---
@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    target_len = get_target_length_desc(request.length)
    if client:
        try:
            sys_msg = f"You are a creative writer. Generate an article ({target_len}) for typing practice."
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "system", "content": sys_msg}, {"role": "user", "content": request.prompt}],
                temperature=0.7
            )
            return {"status": "success", "data": completion.choices[0].message.content}
        except Exception as e:
            print(f"API Error: {e}")
    return {"status": "success", "data": f"[Mock] Generated based on: {request.prompt}"}


# --- API 2: 檔案分析 (Map-Reduce 版) ---
@app.post("/api/analyze")
async def analyze_file(
    file: UploadFile = File(...), 
    mode: str = Form(...),    
    length: str = Form(...)   
):
    print(f"收到檔案: {file.filename}, Mode={mode}, Length={length}")

    # 1. 解析檔案
    raw_text = await extract_text_from_file(file)
    if not raw_text:
        raise HTTPException(status_code=400, detail="無法讀取檔案內容")
    
    total_chars = len(raw_text)
    print(f"檔案總字數: {total_chars}")

    target_len_desc = get_target_length_desc(length)
    final_context = ""

    # 2. 判斷是否需要切片 (門檻設為 4000 字)
    CHUNK_LIMIT = 4000
    
    if client:
        try:
            if total_chars > CHUNK_LIMIT:
                # === A. 長文模式 (Map-Reduce) ===
                print(">>> 啟動長文分析模式 (Map-Reduce) ...")
                chunks = chunk_text(raw_text, CHUNK_LIMIT)
                summaries = []

                # Step 1: 逐段摘要 (Map)
                for i, chunk in enumerate(chunks):
                    print(f"正在處理第 {i+1}/{len(chunks)} 段...")
                    
                    # 提示詞：請 AI 快速抓重點，不要廢話
                    map_system_prompt = "You are a concise summarizer. Extract the key facts and concepts from this text section. Do not add introductions."
                    
                    completion = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": map_system_prompt},
                            {"role": "user", "content": chunk}
                        ],
                        temperature=0.5,
                    )
                    summaries.append(completion.choices[0].message.content)
                
                # Step 2: 合併摘要
                final_context = "\n".join(summaries)
                print(">>> 所有段落摘要完成，準備進行最終生成...")

            else:
                # === B. 短文模式 (直接處理) ===
                print(">>> 啟動短文直接模式 ...")
                final_context = raw_text

            # 3. 最終生成 (Reduce / Final Generation)
            print(f"最終生成中 ({mode} mode)...")
            
            final_system_prompt = ""
            if mode == "extract":
                final_system_prompt = f"You are a summarizer. Based on the provided summary of a document, reconstruct a coherent, well-structured article ({target_len_desc}) for typing practice. Keep it plain text."
            else: # expand
                final_system_prompt = f"You are a teacher. Based on the provided summary of a document, expand on these concepts with external knowledge and examples to create a rich article ({target_len_desc}). For typing practice."

            final_response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": final_system_prompt},
                    {"role": "user", "content": f"Document Key Points:\n\n{final_context}"}
                ],
                temperature=0.7,
            )
            
            return {"status": "success", "data": final_response.choices[0].message.content}

        except Exception as e:
            print(f"Analysis API Error: {e}")
            return {"status": "success", "data": f"[Error] AI Processing failed: {str(e)}"}

    # Mock Mode
    return {
        "status": "success",
        "data": f"[Mock Analysis] Map-Reduce simulation.\nProcessed {total_chars} chars.\nMode: {mode}"
    }

@app.get("/")
def read_root():
    return {"message": "ClickClack Backend v3 (Map-Reduce) is ready!"}