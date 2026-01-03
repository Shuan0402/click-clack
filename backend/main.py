# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- 設定 CORS (跨來源資源共用) ---
# 這非常重要！因為您的 React 在 localhost:5173，而 Python 在 localhost:8000
# 如果不設這個，瀏覽器會因為安全理由拒絕連線。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 測試階段允許所有來源，上線後建議改為 ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from ClickClack Backend!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "FastAPI is running"}