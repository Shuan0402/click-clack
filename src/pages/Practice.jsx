import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useTypingEngine from '../hooks/useTypingEngine';
import VirtualKeyboard from '../components/VirtualKeyboard';

export default function Practice() {
  const { targetText } = useGameStore();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const activeCharRef = useRef(null);

  // 安全跳轉
  useEffect(() => {
    if (!targetText) navigate('/setup');
  }, [targetText, navigate]);

  if (!targetText) return null;

  const { cursor, isCurrentError, isFinished, reset } = useTypingEngine(targetText);

  // --- [核心修正] 絕對置頂滾動邏輯 ---
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeChar = activeCharRef.current;

      // 修正後的算法：
      // 直接讀取該字元在「文字區塊」內的垂直高度。
      // 當我們把容器的 scrollTop 設定為這個高度時，
      // 該行就會被捲動到容器的最頂端 (原本第一行的位置)。
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
      
      {/* 標題區 */}
      <div className="mb-6 text-center shrink-0">
        <h2 className="text-4xl text-gray-800 font-bold tracking-tight mb-2">Typing Arena</h2>
        <p className="text-gray-500">Type the text below:</p>
      </div>

      {/* --- [結構修正] 外層容器 --- */}
      {/* 這個 relative 容器是用來固定「結算畫面」的位置，讓它不會跟著文字捲走 */}
      <div className="relative w-3/4 max-w-4xl h-64 shadow-2xl rounded-xl bg-white border border-gray-200 mb-8">
        
        {/* 1. 結算遮罩 (絕對定位，覆蓋在外層容器上) */}
        {isFinished && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 rounded-xl animate-in fade-in duration-500 backdrop-blur-sm">
             <h3 className="text-4xl font-bold text-green-600 mb-4">Finished! 🎉</h3>
             <div className="flex gap-4">
               <Link to="/setup" className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300 transition shadow">Try Again</Link>
               <Link to="/" className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition shadow">Back Home</Link>
             </div>
          </div>
        )}

        {/* 2. 捲動容器 (Scroll Container) */}
        {/* p-8: 給予視覺上的邊距 (讓字不要貼邊)
            pb-[200px]: 底部超大留白，確保最後一行也能被捲到最上面
        */}
        <div 
          ref={containerRef} 
          className="w-full h-full overflow-hidden leading-relaxed text-2xl p-8 pb-[200px] scroll-smooth"
        >
          {/* 3. 文字內容包裹層 (Relative Wrapper) */}
          {/* 這是計算 offsetTop 的基準點，必須設為 relative */}
          <div className="break-words select-none relative">
            {targetText.split('').map((char, index) => {
              let colorClass = "text-gray-300"; 
              let extraStyle = "";

              if (index < cursor) {
                colorClass = "text-gray-800"; 
              } else if (index === cursor) {
                // 目前游標樣式
                colorClass = "text-black font-bold";
                extraStyle = isCurrentError 
                  ? "bg-red-500 text-white rounded px-1 animate-pulse"
                  : "bg-green-200 text-green-900 rounded px-1 animate-pulse";
              }

              return (
                <span 
                  key={index} 
                  ref={index === cursor ? activeCharRef : null}
                  className={`${colorClass} ${extraStyle} inline-block transition-colors duration-100 min-w-[0.5rem]`}
                >
                  {char === '\n' ? '↵' : char}
                  {char === '\n' && <br />} 
                </span>
              );
            })}
            
            {/* 游標補償 (打完最後一字時) */}
            {cursor === targetText.length && (
               <span 
                 ref={activeCharRef} 
                 className="inline-block w-2 h-6 bg-black ml-1 animate-pulse align-middle"
               />
            )}
          </div>
        </div>
      </div>

      {/* 鍵盤區 */}
      <div className="shrink-0 mb-4 z-10">
        <VirtualKeyboard nextChar={targetText[cursor]} isError={isCurrentError} />
      </div>

      {/* 底部連結 */}
      <div className="shrink-0">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">Quit Practice</Link>
      </div>
    </div>
  );
}