import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useTypingEngine from '../hooks/useTypingEngine';
import VirtualKeyboard from '../components/VirtualKeyboard';

export default function Practice() {
  const { targetText, setGameResults } = useGameStore();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const activeCharRef = useRef(null);

  const hasRecordedRef = useRef(false);

  // 安全跳轉
  useEffect(() => {
    if (!targetText) navigate('/setup');
  }, [targetText, navigate]);

  if (!targetText) return null;

  const { cursor, isCurrentError, isFinished, reset, stats } = useTypingEngine(targetText);

  useEffect(() => {
    // 👇 加入 !hasRecordedRef.current 的檢查
    if (isFinished && !hasRecordedRef.current) {
      console.log("Game Finished! Recording results...");
      
      // 1. 馬上上鎖！防止後續的重複執行
      hasRecordedRef.current = true;

      setGameResults({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timeElapsed: stats.timeElapsed,
        errorCount: stats.errorCount,
        totalChars: targetText.length
      });

      // const timer = setTimeout(() => {
      //   navigate('/result');
      // }, 500);
      navigate('/result');

      // return () => clearTimeout(timer);
    }
  }, [isFinished, navigate, setGameResults, stats, targetText.length]);

  // --- [核心修正] 絕對置頂滾動邏輯 ---
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
      
      {/* Header */}
      <div className="mb-6 text-center shrink-0">
        <h2 className="text-4xl text-gray-800 font-bold tracking-tight mb-2">Typing Arena</h2>
        <div className="flex gap-4 justify-center text-gray-500 font-mono text-sm">
           {/* [選用] 即時顯示 WPM (如果您想要的話可以打開) */}
           {/* <span>WPM: {stats.wpm}</span> */}
           {/* <span>Errors: {stats.errorCount}</span> */}
        </div>
      </div>

      {/* 外層容器 (注意：這裡移除了原本內嵌的 Finished 遮罩，因為我們會直接跳頁) */}
      <div className="relative w-3/4 max-w-4xl h-64 shadow-2xl rounded-xl bg-white border border-gray-200 mb-8">
        
        {/* 文字顯示區 (保持您原本的 Code) */}
        <div 
          ref={containerRef} 
          className="w-full h-full overflow-hidden leading-relaxed text-2xl p-8 pb-[200px] scroll-smooth"
        >
          <div className="break-words select-none relative">
            {targetText.split('').map((char, index) => {
               // ... (保持原本的 map 邏輯，這裡省略以節省篇幅) ...
               // 請直接沿用上一版 Practice.jsx 的渲染邏輯
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

      <div className="shrink-0 mb-4 z-10">
        <VirtualKeyboard nextChar={targetText[cursor]} isError={isCurrentError} />
      </div>

      <div className="shrink-0">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">Quit Practice</Link>
      </div>
    </div>
  );
}