import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Clock, XCircle, RotateCcw, Home } from 'lucide-react';
import useGameStore from '../store/useGameStore';

export default function Result() {
  const { gameResults, targetText } = useGameStore();
  const navigate = useNavigate();

  // 如果直接輸入網址進來，沒有成績，就踢回首頁
  useEffect(() => {
    if (!gameResults || gameResults.totalChars === 0) {
      navigate('/');
    }
  }, [gameResults, navigate]);

  if (!gameResults) return null;

  // 評語邏輯
  const getFeedback = (wpm) => {
    if (wpm > 80) return "Master Typist! 🚀";
    if (wpm > 60) return "Excellent Speed! 🔥";
    if (wpm > 40) return "Great Job! 👍";
    return "Keep Practicing! 🌱";
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-mono">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10 border border-stone-200 text-center animate-in zoom-in duration-300">
        
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-400">
            <Trophy size={40} className="text-yellow-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Practice Complete!</h1>
        <p className="text-xl text-gray-500 mb-8">{getFeedback(gameResults.wpm)}</p>

        {/* 核心數據卡片 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">WPM</p>
            <p className="text-6xl font-black text-gray-900">{gameResults.wpm}</p>
          </div>
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Accuracy</p>
            <p className={`text-6xl font-black ${gameResults.accuracy >= 90 ? 'text-green-600' : 'text-orange-500'}`}>
              {gameResults.accuracy}%
            </p>
          </div>
        </div>

        {/* 詳細數據 */}
        <div className="flex justify-center gap-8 text-gray-600 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} /> 
            <span>Time: <b>{gameResults.timeElapsed.toFixed(1)}s</b></span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={16} /> 
            <span>Errors: <b>{gameResults.errorCount}</b></span>
          </div>
          <div className="flex items-center gap-2">
             <span>Length: <b>{gameResults.totalChars}</b> chars</span>
          </div>
        </div>

        {/* 動作按鈕 */}
        <div className="flex gap-4 justify-center">
          <Link 
            to="/setup" 
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 font-bold shadow-lg hover:scale-105 active:scale-95"
          >
            <RotateCcw size={18} /> Play Again
          </Link>
          <Link 
            to="/" 
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 font-bold"
          >
            <Home size={18} /> Home
          </Link>
        </div>

      </div>
    </div>
  );
}