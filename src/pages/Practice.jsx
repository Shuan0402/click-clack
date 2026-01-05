import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Activity, Zap, RefreshCcw } from 'lucide-react'; // 引入圖標
import useGameStore from '../store/useGameStore';
import useTypingEngine from '../hooks/useTypingEngine';
import VirtualKeyboard from '../components/VirtualKeyboard';

export default function Practice() {
  const { targetText, setGameResults, gameMode, timeLimit } = useGameStore();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const activeCharRef = useRef(null);
  const hasRecordedRef = useRef(false);

  // --- 1. 時間控制狀態 ---
  // 如果是 Time Attack，初始時間為 timeLimit；Endless 則不需要倒數
  const [timeLeft, setTimeLeft] = useState(gameMode === 'time' ? timeLimit : 0);
  
  // 安全跳轉
  useEffect(() => {
    if (!targetText) navigate('/setup');
  }, [targetText, navigate]);

  if (!targetText) return null;

  // 引用您的打字引擎
  const { cursor, isCurrentError, isFinished, reset, stats } = useTypingEngine(targetText);

  // --- 2. 計時器邏輯 (Time Attack 專用) ---
  useEffect(() => {
    let timerId;
    
    // 只有在 Time Attack 模式，且遊戲未結束，且還有時間時才倒數
    if (gameMode === 'time' && !isFinished && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [gameMode, isFinished, timeLeft]);

  // --- 3. 遊戲結束邏輯 (整合兩種結束條件) ---
  useEffect(() => {
    // 條件 A: 字打完了 (Endless 或 Time Attack 提早打完)
    // 條件 B: 時間到了 (Time Attack 專用)
    const isTimeUp = gameMode === 'time' && timeLeft <= 0;

    if ((isFinished || isTimeUp) && !hasRecordedRef.current) {
      console.log("Game Finished! Recording results...");
      
      // 馬上上鎖
      hasRecordedRef.current = true;

      // 計算最終時間 (如果是時間到，就是用滿 timeLimit；如果是提早打完，就是 stats.timeElapsed)
      let finalTimeElapsed = stats.timeElapsed;
      if (isTimeUp) {
          finalTimeElapsed = timeLimit;
      }

      setGameResults({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timeElapsed: finalTimeElapsed,
        errorCount: stats.errorCount,
        totalChars: targetText.length,
        mode: gameMode // 紀錄模式
      });

      navigate('/result');
    }
  }, [isFinished, timeLeft, gameMode, navigate, setGameResults, stats, targetText.length, timeLimit]);


  // --- 4. 絕對置頂滾動邏輯 (保留您原本的) ---
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeChar = activeCharRef.current;
      const targetScrollTop = activeChar.offsetTop;
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, [cursor]);

  // 組件掛載時重置
  useEffect(() => { reset(); }, [reset]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-100 font-mono overflow-hidden">
      
      {/* --- Header (新增：顯示模式與時間) --- */}
      <div className="mb-6 w-full max-w-4xl flex justify-between items-end px-4">
        <div>
           <h2 className="text-3xl text-gray-800 font-bold tracking-tight">Typing Arena</h2>
           <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
             <RefreshCcw size={14} />
             <span className="capitalize">{gameMode === 'time' ? 'Time Attack' : 'Endless Mode'}</span>
           </div>
        </div>

        {/* 狀態儀表板 */}
        <div className="flex gap-6 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
          {/* 時間顯示 */}
          <div className={`flex items-center gap-2 font-bold text-xl ${gameMode === 'time' && timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
             <Clock size={20} />
             {gameMode === 'time' ? `${timeLeft}s` : '∞'}
          </div>
          
          {/* WPM 顯示 */}
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
             <Zap size={20} />
             {stats.wpm} WPM
          </div>
        </div>
      </div>

      {/* --- 文字顯示區 (保留您原本的) --- */}
      <div className="relative w-3/4 max-w-4xl h-64 shadow-2xl rounded-xl bg-white border border-gray-200 mb-8">
        <div 
          ref={containerRef} 
          className="w-full h-full overflow-hidden leading-relaxed text-2xl p-8 pb-[200px] scroll-smooth"
        >
          <div className="break-words select-none relative">
            {targetText.split('').map((char, index) => {
               let colorClass = "text-gray-300"; 
               let extraStyle = "";
               if (index < cursor) colorClass = "text-gray-800"; 
               else if (index === cursor) {
                 colorClass = "text-black font-bold";
                 extraStyle = isCurrentError ? "bg-red-500 text-white rounded px-1 animate-pulse" : "bg-green-200 text-green-900 rounded px-1 animate-pulse";
               }
               return (
                 <span key={index} ref={index === cursor ? activeCharRef : null} className={`${colorClass} ${extraStyle} inline-block transition-colors duration-100 min-w-[0.5rem]`}>
                   {char === '\n' ? '↵' : char}{char === '\n' && <br />} 
                 </span>
               );
            })}
             {cursor === targetText.length && (
               <span ref={activeCharRef} className="inline-block w-2 h-6 bg-black ml-1 animate-pulse align-middle"/>
            )}
          </div>
        </div>
      </div>

      {/* 鍵盤與退出 */}
      <div className="shrink-0 mb-4 z-10">
        <VirtualKeyboard nextChar={targetText[cursor]} isError={isCurrentError} />
      </div>

      <div className="shrink-0">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">Quit Practice</Link>
      </div>
    </div>
  );
}