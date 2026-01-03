import os
import time
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import pypdf
from pptx import Presentation
import io

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = None

# 設定 Groq / OpenAI
if api_key:
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1" # 如果是用 OpenAI，這行要拿掉
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

# 一般文字生成的 Request Model
class GenerateRequest(BaseModel):
    prompt: str
    mode: str = "creative" 
    length: str = "medium"

# --- 輔助函式：解析檔案內容 ---
async def extract_text_from_file(file: UploadFile) -> str:
    content = ""
    filename = file.filename.lower()
    
    # 讀取檔案 bytes
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
        else:
            return "" # 不支援的格式

    except Exception as e:
        print(f"解析失敗: {e}")
        return ""

    return content.strip()

# --- API 1: 純文字生成 (AI Writer) ---
@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    # (這部分保持原本的邏輯，為了節省篇幅我這裡簡化，請保留您上一步驟完成的完整代碼)
    # ... 您可以直接複製上一步驟的內容，或是如果您需要我再貼一次也可以 ...
    # 為了確保完整性，我還是貼上核心邏輯：
    
    word_count_map = {"short": "around 100 words", "medium": "around 250 words", "long": "around 500 words"}
    target_len = word_count_map.get(request.length, "around 250 words")
    
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


# --- API 2: [新增] 檔案分析與生成 (Smart Review) ---
@app.post("/api/analyze")
async def analyze_file(
    file: UploadFile = File(...), 
    mode: str = Form(...),    # extract | expand
    length: str = Form(...)   # short | medium | long
):
    print(f"收到檔案: {file.filename}, Mode={mode}, Length={length}")

    # 1. 解析檔案文字
    raw_text = await extract_text_from_file(file)
    if not raw_text:
        raise HTTPException(status_code=400, detail="無法讀取檔案內容或檔案為空")

    # 限制讀取的原始字數，避免超過 AI Token 上限 (只讀前 3000 字)
    raw_text_truncated = raw_text[:3000]

    # 2. 定義字數
    word_count_map = {"short": "around 100 words", "medium": "around 250 words", "long": "around 500 words"}
    target_len = word_count_map.get(length, "around 250 words")

    # 3. 呼叫 AI
    if client:
        try:
            system_instruction = ""
            if mode == "extract":
                system_instruction = f"You are a summarizer. Read the provided text and extract key concepts to form a coherent article ({target_len}) for typing practice. Keep it plain text."
            else: # expand
                system_instruction = f"You are a teacher. Read the provided text concepts, and write a detailed article ({target_len}) that explains these concepts and adds external knowledge/examples. For typing practice."

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": f"The document content is:\n\n{raw_text_truncated}"}
                ],
                temperature=0.5, # 解析類任務建議溫度低一點，比較準確
            )
            return {"status": "success", "data": completion.choices[0].message.content}
            
        except Exception as e:
            print(f"Analysis API Error: {e}")
            # 出錯時回傳 Mock
            return {
                "status": "success", 
                "data": f"[Mock Analysis] Failed to call AI. Here is a summary of {file.filename}: {raw_text_truncated[:200]}..."
            }
    
    # Mock Mode (沒 Key 時)
    return {
        "status": "success",
        "data": f"[Mock Analysis of {file.filename}]\nMode: {mode}\nLength: {length}\n\nExtracted Content Start:\n{raw_text_truncated[:300]}..."
    }

@app.get("/")
def read_root():
    return {"message": "ClickClack Backend v2 (File Support) is ready!"}