import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useTypingEngine from '../hooks/useTypingEngine';
import VirtualKeyboard from '../components/VirtualKeyboard';

// 暫時的測試文章
const DEMO_TEXT = "Hello! Check out: user@email.com #Coding";

export default function Practice() {
  // 從 Store 取得文章 (目前先用 DEMO_TEXT 頂替)
  // const { articleContent } = useGameStore(); 
  const targetText = DEMO_TEXT; 

  // 使用我們寫好的 Hook
  const { cursor, isCurrentError, isFinished, reset } = useTypingEngine(targetText);

  // 當組件掛載時，確保重置狀態
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-100 font-mono">
      {/* 標題與狀態 */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl text-gray-700 mb-2">Typing Arena</h2>
        <p className="text-gray-500">Type the text below:</p>
      </div>

      {/* --- 打字機顯示區 (核心 UI) --- */}
      <div className="relative w-3/4 max-w-4xl p-8 bg-white shadow-lg rounded-lg border-t-4 border-gray-800 min-h-[200px] leading-relaxed text-2xl">
        
        {/* 完成時的遮罩 */}
        {isFinished && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
             <div className="text-center">
                <h3 className="text-4xl font-bold text-green-600 mb-4">Finished! 🎉</h3>
                <Link to="/result" className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700">
                  Check Results
                </Link>
             </div>
          </div>
        )}

        {/* 文字渲染區 */}
        <div className="break-words select-none">
          {targetText.split('').map((char, index) => {
            let colorClass = "text-gray-300"; // 預設：還沒打到的字 (淺色)
            let extraStyle = "";

            if (index < cursor) {
              // 已經打完的字 (正常顯示，深色)
              colorClass = "text-gray-800";
            } else if (index === cursor) {
              // 目前正在打的字 (粗體 + 游標)
              colorClass = "text-black font-bold";
              // 如果打錯了，變紅色；否則給他一個底線或背景提示
              extraStyle = isCurrentError ? "bg-red-200 text-red-600" : "bg-gray-200";
            }

            return (
              <span key={index} className={`${colorClass} ${extraStyle} px-[1px] rounded transition-colors duration-100`}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <VirtualKeyboard 
          nextChar={targetText[cursor]} 
          isError={isCurrentError} 
        />
      </div>

      {/* 底部輔助連結 */}
      <div className="mt-12">
        <Link to="/" className="text-gray-400 hover:text-gray-600">Quit Practice</Link>
      </div>
    </div>
  );
}