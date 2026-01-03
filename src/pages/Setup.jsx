import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bot, Clock, Play, Upload, Sparkles, FileSearch, BookOpen, AlignLeft } from 'lucide-react'; 
import useGameStore from '../store/useGameStore';

export default function Setup() {
  const navigate = useNavigate();
  const { 
    isSoundEnabled, toggleSound, 
    setTargetText, setGameMode, setTimeLimit, 
    timeLimit, gameMode 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('manual');
  
  const [manualText, setManualText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('extract'); 
  
  // 👇 [新增] 字數長度設定 ('short' | 'medium' | 'long')
  const [targetLength, setTargetLength] = useState('medium'); 

  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (e, targetStateSetter) => {
    const file = e.target.files[0];
    if (!file) return;

    if (activeTab === 'manual') {
      const reader = new FileReader();
      reader.onload = (event) => setManualText(event.target.result);
      reader.readAsText(file);
    } 
    else if (activeTab === 'ai-file') {
      setSelectedFile(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    let generatedText = "";

    try {
      let payload = {};
      
      // 準備發送給後端的資料，加入 length 參數
      if (activeTab === 'ai-prompt') {
        if (!aiPrompt.trim()) { alert("Please enter a prompt!"); setIsGenerating(false); return; }
        payload = {
          prompt: aiPrompt,
          mode: "creative",
          length: targetLength // 👈 傳送長度
        };
      } 
      else if (activeTab === 'ai-file') {
        // 檔案上傳功能 (這部分我們還沒實作後端，先用 Mock 擋著或稍後實作)
        alert("File upload feature is coming next! Check console for payload.");
        console.log("File Payload would be:", { file: selectedFile, mode: analysisMode, length: targetLength });
        setIsGenerating(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      generatedText = data.data;

      setManualText(generatedText);
      setActiveTab('manual');

    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to backend.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartGame = () => {
    if (!manualText.trim()) {
      alert("Please check your text content!");
      return;
    }
    setTargetText(manualText); 
    navigate('/practice');    
  };

  // 輔助元件：長度選擇按鈕
  const LengthSelector = () => (
    <div className="mb-6 bg-stone-50 p-4 rounded-lg border border-stone-200">
      <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <AlignLeft size={16} /> Target Length
      </label>
      <div className="flex gap-4">
        {['short', 'medium', 'long'].map((len) => (
          <button
            key={len}
            onClick={() => setTargetLength(len)}
            className={`flex-1 py-2 rounded capitalize border transition-all ${
              targetLength === len 
                ? 'bg-white border-blue-500 text-blue-600 shadow-md ring-1 ring-blue-500 font-bold' 
                : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
            }`}
          >
            {len}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-mono text-gray-800">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row h-[650px]">
        
        {/* 左側導航 (不變) */}
        <div className="bg-gray-900 text-stone-300 w-full md:w-64 p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-8 tracking-wider">ClickClack</h1>
          <nav className="flex-1 space-y-2">
            <button onClick={() => setActiveTab('manual')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'manual' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
              <FileText size={18} /> Manual Input
            </button>
            <button onClick={() => setActiveTab('ai-prompt')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'ai-prompt' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
              <Bot size={18} /> AI Writer
            </button>
            <button onClick={() => setActiveTab('ai-file')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all ${activeTab === 'ai-file' ? 'bg-stone-700 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
              <FileSearch size={18} /> Smart Review
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t border-gray-700">
            <button onClick={toggleSound} className={`w-full py-2 rounded text-sm font-bold border transition-colors flex items-center justify-center gap-2 ${isSoundEnabled ? 'bg-green-900/30 border-green-600 text-green-400' : 'bg-red-900/30 border-red-600 text-red-400'}`}>
              {isSoundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </button>
          </div>
        </div>

        {/* 右側內容區 */}
        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          
          {/* Mode Selector (不變) */}
          <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-gray-700 font-bold"><Clock size={18} /> Mode:</div>
            <div className="flex gap-2">
              <button onClick={() => setGameMode('time')} className={`px-3 py-1 rounded text-sm transition-colors ${gameMode === 'time' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>Time Attack</button>
              <button onClick={() => setGameMode('endless')} className={`px-3 py-1 rounded text-sm transition-colors ${gameMode === 'endless' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>Endless</button>
            </div>
            {gameMode === 'time' && (
               <input type="range" min="15" max="300" step="15" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" title={`Time limit: ${timeLimit}s`} />
            )}
          </div>

          <div className="flex-1 flex flex-col">
            
            {/* Tab 1: Manual */}
            {activeTab === 'manual' && (
              <div className="animate-in fade-in duration-300 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Custom Text</h2>
                <textarea className="flex-1 w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none resize-none bg-stone-50 text-lg leading-relaxed" placeholder="Paste your text here..." value={manualText} onChange={(e) => setManualText(e.target.value)} />
                <div className="mt-4 flex justify-between items-center">
                  <label className="cursor-pointer text-sm text-blue-600 hover:underline flex items-center gap-1"><Upload size={14} /> Upload .txt file <input type="file" accept=".txt" className="hidden" onChange={(e) => handleFileSelect(e, setManualText)} /></label>
                  <span className="text-xs text-gray-400">{manualText.length} characters</span>
                </div>
              </div>
            )}

            {/* Tab 2: AI Writer */}
            {activeTab === 'ai-prompt' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bot /> AI Creative Writer</h2>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Topic</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. History of Jazz..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                </div>
                
                {/* 👇 加入長度選擇器 */}
                <LengthSelector />

                <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                  {isGenerating ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                  {isGenerating ? 'Generating...' : 'Generate Article'}
                </button>
              </div>
            )}

            {/* Tab 3: Smart Review */}
            {activeTab === 'ai-file' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileSearch /> Smart Review & Analyze</h2>
                
                {/* 檔案上傳區 (UI Only) */}
                <div className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold"><FileText size={20} /> {selectedFile.name} <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 hover:underline ml-2">(Remove)</button></div>
                  ) : (
                    <label className="cursor-pointer block"><Upload className="mx-auto text-gray-400 mb-2" size={32} /><span className="text-gray-600 font-medium">Click to upload document</span><input type="file" accept=".txt,.pdf,.pptx" className="hidden" onChange={(e) => handleFileSelect(e)} /></label>
                  )}
                </div>

                {/* 模式選擇 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={() => setAnalysisMode('extract')} className={`p-3 rounded border text-left transition-all ${analysisMode === 'extract' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-2"><FileText size={16}/> Extraction</div>
                  </button>
                  <button onClick={() => setAnalysisMode('expand')} className={`p-3 rounded border text-left transition-all ${analysisMode === 'expand' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-2"><BookOpen size={16}/> Expansion</div>
                  </button>
                </div>

                {/* 👇 加入長度選擇器 */}
                <LengthSelector />

                <button onClick={handleGenerate} disabled={isGenerating || !selectedFile} className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                  {isGenerating ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                  {isGenerating ? 'Analyzing & Writing...' : 'Start Analysis'}
                </button>
              </div>
            )}
          </div>

          {activeTab === 'manual' && (
            <div className="mt-6 flex justify-end">
              <button onClick={handleStartGame} className="px-8 py-3 bg-gray-900 text-white text-lg font-bold rounded shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">Start Practice <Play size={20} fill="white" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}