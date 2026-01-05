import { useNavigate } from 'react-router-dom';
import { RefreshCcw, Home, Trophy, Target, Zap, Clock } from 'lucide-react';
import useGameStore from '../store/useGameStore';

export default function Result() {
  const navigate = useNavigate();
  const { gameResults } = useGameStore();
  const { wpm, accuracy, timeElapsed, mode } = gameResults;

  // 根據 WPM 給予評價
  const getFeedback = () => {
    if (wpm > 80) return "Grandmaster Typist! 🚀";
    if (wpm > 60) return "Professional Speed! 🔥";
    if (wpm > 40) return "Great Job! Keep it up! 👍";
    return "Nice Practice! Accuracy first! 🌱";
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-mono">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10 text-center border border-stone-200 animate-in fade-in zoom-in duration-500">
        
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 shadow-inner">
            <Trophy size={64} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-800 mb-2">Session Complete!</h1>
        <p className="text-xl text-gray-500 font-medium mb-10">{getFeedback()}</p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Zap size={24} /> <span className="font-bold">WPM</span>
            </div>
            <span className="text-5xl font-black text-gray-800">{wpm}</span>
          </div>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Target size={24} /> <span className="font-bold">Accuracy</span>
            </div>
            <span className="text-5xl font-black text-gray-800">{accuracy}%</span>
          </div>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Clock size={24} /> <span className="font-bold">Time</span>
            </div>
            <span className="text-3xl font-black text-gray-800">{timeElapsed}s</span>
          </div>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <RefreshCcw size={24} /> <span className="font-bold">Mode</span>
            </div>
            <span className="text-2xl font-black text-gray-800 capitalize">{mode === 'time' ? 'Time Attack' : 'Endless'}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/setup')} 
            className="flex items-center gap-2 px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            <Home size={20} /> New Setup
          </button>
          
          <button 
            onClick={() => navigate('/practice')} 
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCcw size={20} /> Retry Same Text
          </button>
        </div>

      </div>
    </div>
  );
}