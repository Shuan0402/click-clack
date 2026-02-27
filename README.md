# ClickClack

ClickClack 是一個以 React 建構的 AI 驅動打字練習應用程式，結合了生成式 AI 與文件分析技術，提供使用者從「創意寫作」到「文件複習」的客製化打字訓練體驗。該應用支援多種輸入模式、即時數據回饋以及智慧視覺化鍵盤輔助。

## 功能簡介
### 練習模式
- **時限挑戰 (Time Attack)**：自訂 15 秒至 300 秒倒數，挑戰極速極限。
- **無盡模式 (Endless)**：不限時間，專注於完成整篇文稿。
- **即時數據監控**：即時顯示 WPM（字數/分鐘）與當前準確率。
- **自動滾動系統**：打字時文字區域會自動置頂滾動，確保視線集中。

### 內容生成功能 (AI Power)
- **手動輸入**：支援貼上自訂文字或上傳 `.txt` 檔案。
- **AI 創意寫手 (AI Writer)**：輸入主題關鍵字，由 AI 自動生成對應長度的練習文章。
- **智慧文件審閱 (Smart Review)**：
    - 支援上傳 `.pdf`、`.pptx` 檔案。
    - **重點提取 (Extraction)**：自動從文件中擷取核心內容作為題庫。
    - **內容擴充 (Expansion)**：根據文件主題，由 AI 延伸撰寫更具深度的練習文稿。

### 智慧鍵盤與 UI 交互
- **虛擬視覺化鍵盤**：
    - 即時追蹤實體鍵盤按下狀態。
    - **智慧提示**：動態高亮下一個應輸入的按鍵（含 Shift 組合鍵提示）。
    - **錯誤警示**：輸入錯誤時，虛擬按鍵與文字區域同步紅光閃爍提示。
- **打字音效切換**：提供沉浸式打字反饋音效。
- **結果評價系統**：根據 WPM 表現給予等級評價（如 Grandmaster, Professional 等）。

## 使用技術
### 前端
- React 18
- React Router DOM (HashRouter)
- Tailwind CSS
- Zustand (狀態管理)
- Lucide React (圖標庫)
- Vite

### 後端與服務
- **AI 服務**：部署於 Render 的 Node.js / Python API
- **大型語言模型**：處理文章生成、文件摘要與內容擴充

### 其他
- 檔案解析處理 (PDF/PPTX 提取)
- GitHub Pages 部署
- 自動滾動邏輯與鍵盤事件偵聽

## 專案架構概述
```css=
src/
├── components/
│   ├── VirtualKeyboard.jsx   # 核心組件：處理鍵盤映射與視覺高亮
│   └── ...
│
├── hooks/
│   └── useTypingEngine.js    # 自定義 Hook：管理打字邏輯、準確率與 WPM 計算
│
├── pages/
│   ├── Home.jsx             # 入口首頁
│   ├── Setup.jsx            # 設定頁：包含模式切換與 AI 生成介面
│   ├── Practice.jsx         # 練習頁：打字核心邏輯與計時器
│   └── Result.jsx           # 結果頁：數據結算與反饋評價
│
├── store/
│   └── useGameStore.js       # 全域狀態管理 (Zustand)
│
├── App.jsx                  # 路由配置與全域風格定調
└── main.jsx
```