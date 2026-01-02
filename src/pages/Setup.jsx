import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bot, Clock, Play, Upload, Sparkles, FileSearch, BookOpen } from 'lucide-react'; 
import useGameStore from '../store/useGameStore';

export default function Setup() {
  const navigate = useNavigate();
  const { 
    isSoundEnabled, toggleSound, 
    setTargetText, setGameMode, setTimeLimit, 
    timeLimit, gameMode 
  } = useGameStore();

  // Tabs: 'manual' (直接輸入), 'ai-prompt' (憑空生成), 'ai-file' (檔案分析)
  const [activeTab, setActiveTab] = useState('manual');
  
  // 各個模式的輸入狀態
  const [manualText, setManualText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('extract'); // 'extract' (擷取) | 'expand' (延伸)

  const [isGenerating, setIsGenerating] = useState(false);

  // --- 通用：處理檔案選擇 ---
  const handleFileSelect = (e, targetStateSetter) => {
    const file = e.target.files[0];
    if (!file) return;

    // 如果是 Manual 模式，直接讀取內容到輸入框
    if (activeTab === 'manual') {
      const reader = new FileReader();
      reader.onload = (event) => setManualText(event.target.result);
      reader.readAsText(file);
    } 
    // 如果是 AI 分析模式，只存檔案物件 (模擬上傳給後端)
    else if (activeTab === 'ai-file') {
      setSelectedFile(file);
    }
  };

  // --- 核心：模擬 AI 生成邏輯 (Mock) ---
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // 模擬網路延遲
    setTimeout(() => {
      let mockResponse = "";

      if (activeTab === 'ai-prompt') {
        // 模式 2: 純指令生成
        if (!aiPrompt.trim()) { alert("Please enter a prompt!"); setIsGenerating(false); return; }
        mockResponse = `[AI Generated] Based on prompt "${aiPrompt}": \nTechnology is reshaping our world. From AI to green energy, innovation is the key to our future. (Mock Data)`;
      } 
      else if (activeTab === 'ai-file') {
        // 模式 3: 檔案分析
        if (!selectedFile) { alert("Please select a file!"); setIsGenerating(false); return; }
        
        if (analysisMode === 'extract') {
          mockResponse = `[Extraction Mode] Summary of ${selectedFile.name}:\nThis document discusses key concepts of software engineering. The main points are: 1. Requirement Analysis, 2. System Design, 3. Testing protocols. It emphasizes the importance of the SDLC life cycle.`;
        } else {
          mockResponse = `[Expansion Mode] Deep Dive into ${selectedFile.name}:\nStarting from the concepts in your file, we can look further into modern applications. While the file mentions basic SDLC, current industry trends favor DevOps and CI/CD pipelines. This article explores how these advanced methodologies integrate with the traditional concepts you uploaded.`;
        }
      }

      // 生成完畢，將結果填入 Manual 頁面供使用者最後確認
      setManualText(mockResponse);
      setActiveTab('manual'); 
      setIsGenerating(false);
    }, 2000);
  };

  // --- 開始遊戲 ---
  const handleStartGame = () => {
    if (!manualText.trim()) {
      alert("Please check your text content!");
      return;
    }
    setTargetText(manualText); 
    navigate('/practice');    
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-mono text-gray-800">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row h-[600px]">
        
        {/* 左側：控制面板 (深色區) */}
        <div className="bg-gray-900 text-stone-300 w-full md:w-64 p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-8 tracking-wider">ClickClack</h1>
          
          {/* 導航 Tabs */}
          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'manual' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}
            >
              <FileText size={18} /> Manual Input
            </button>
            <button 
              onClick={() => setActiveTab('ai-prompt')}
              className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'ai-prompt' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}
            >
              <Bot size={18} /> AI Writer
            </button>
            <button 
              onClick={() => setActiveTab('ai-file')}
              className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'ai-file' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}
            >
              <FileSearch size={18} /> Smart Review
            </button>
          </nav>

          {/* 底部音效開關 */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <button 
              onClick={toggleSound}
              className={`w-full py-2 rounded text-sm font-bold border transition-colors flex items-center justify-center gap-2 ${isSoundEnabled ? 'bg-green-900/30 border-green-600 text-green-400' : 'bg-red-900/30 border-red-600 text-red-400'}`}
            >
              {isSoundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </button>
          </div>
        </div>

        {/* 右側：內容操作區 */}
        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          
          {/* 頂部：遊戲模式設定 */}
          <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Clock size={18} /> Mode:
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setGameMode('time')}
                className={`px-3 py-1 rounded text-sm transition-colors ${gameMode === 'time' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Time Attack
              </button>
              <button 
                onClick={() => setGameMode('endless')}
                className={`px-3 py-1 rounded text-sm transition-colors ${gameMode === 'endless' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Endless
              </button>
            </div>
            {gameMode === 'time' && (
               <input 
                 type="range" min="15" max="300" step="15" 
                 value={timeLimit}
                 onChange={(e) => setTimeLimit(Number(e.target.value))}
                 className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                 title={`Time limit: ${timeLimit}s`}
               />
            )}
          </div>

          {/* 主要內容區 (根據 Tab 切換) */}
          <div className="flex-1 flex flex-col">
            
            {/* Tab 1: Manual Input */}
            {activeTab === 'manual' && (
              <div className="animate-in fade-in duration-300 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText /> Custom Text
                </h2>
                <textarea 
                  className="flex-1 w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none resize-none bg-stone-50 text-lg leading-relaxed"
                  placeholder="Paste your text here, or generate one using AI tabs..."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                />
                <div className="mt-4 flex justify-between items-center">
                  <label className="cursor-pointer text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Upload size={14} /> Upload .txt file
                    <input type="file" accept=".txt" className="hidden" onChange={(e) => handleFileSelect(e, setManualText)} />
                  </label>
                  <span className="text-xs text-gray-400">
                    {manualText.length} characters
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: AI Writer */}
            {activeTab === 'ai-prompt' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bot /> AI Creative Writer
                </h2>
                <p className="text-gray-500 mb-4 text-sm">Enter a topic, and the AI will generate a unique article for you to practice.</p>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Topic</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. History of Jazz, Benefits of Hiking..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                  {isGenerating ? 'Generating...' : 'Generate Article'}
                </button>
              </div>
            )}

            {/* Tab 3: Smart Review (New Feature!) */}
            {activeTab === 'ai-file' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileSearch /> Smart Review & Analyze
                </h2>
                <p className="text-gray-500 mb-6 text-sm">Upload a document (PDF/PPTX/TXT) and let AI prepare a study guide for you.</p>

                {/* 1. File Upload Area */}
                <div className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                       <FileText size={20} /> {selectedFile.name}
                       <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 hover:underline ml-2">(Remove)</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <span className="text-gray-600 font-medium">Click to upload document</span>
                      <p className="text-xs text-gray-400 mt-1">Supports .txt (PDF/PPTX coming soon)</p>
                      <input type="file" accept=".txt,.pdf,.pptx" className="hidden" onChange={(e) => handleFileSelect(e)} />
                    </label>
                  )}
                </div>

                {/* 2. Generation Mode Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => setAnalysisMode('extract')}
                    className={`p-4 rounded border text-left transition-all ${analysisMode === 'extract' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="font-bold text-gray-800 flex items-center gap-2"><FileText size={16}/> Extraction</div>
                    <p className="text-xs text-gray-500 mt-1">Summarize content strictly based on the file.</p>
                  </button>

                  <button 
                    onClick={() => setAnalysisMode('expand')}
                    className={`p-4 rounded border text-left transition-all ${analysisMode === 'expand' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="font-bold text-gray-800 flex items-center gap-2"><BookOpen size={16}/> Expansion</div>
                    <p className="text-xs text-gray-500 mt-1">Analyze file and expand with external knowledge.</p>
                  </button>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedFile}
                  className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                  {isGenerating ? 'Analyzing & Writing...' : 'Start Analysis'}
                </button>
              </div>
            )}

          </div>

          {/* Action Button (Only show on Manual tab to avoid confusion, or always show) */}
          {activeTab === 'manual' && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleStartGame}
                className="px-8 py-3 bg-gray-900 text-white text-lg font-bold rounded shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Start Practice <Play size={20} fill="white" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}