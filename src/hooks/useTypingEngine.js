import { useState, useEffect, useCallback, useRef } from 'react';
import useTypewriterSound from './useTypewriterSound';

// 這是一個自定義 Hook，負責處理所有的打字邏輯
export default function useTypingEngine(targetText) {
  const [cursor, setCursor] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isCurrentError, setIsCurrentError] = useState(false);

  // 重置功能 (當文章改變或重來時用)
  const reset = useCallback(() => {
    setCursor(0);
    setErrorCount(0);
    setIsCurrentError(false);
  }, []);

  // 初始化音效
  const { triggerKeySound, triggerErrorSound } = useTypewriterSound();

  const stateRef = useRef({
    cursor: 0,
    targetText: targetText
  });

  // 鍵盤事件處理核心
  const handleKeyDown = useCallback((e) => {
    // 1. 如果已經打完了，就不處理
    if (cursor >= targetText.length) return;

    const key = e.key;
    const targetChar = targetText[cursor];

    // 2. 忽略系統按鍵 (Shift, Ctrl, Alt, CapsLock 等)
    if (key.length > 1 && key !== 'Backspace') return;

    // 3. 處理 Backspace (倒退鍵)
    // 選項：如果你希望允許使用者倒退修改，可以在這裡寫。
    // 但復古打字機通常是「一去不復返」或「嚴格模式」，我們先做嚴格模式：
    // 只有打對才能前進，打錯會卡住。
    
    // 4. 比對輸入字元
    if (key === targetChar) {
      // 答對了！
      setCursor((prev) => prev + 1);
      setIsCurrentError(false); // 清除錯誤狀態
      
      triggerKeySound();
    } else {
      // 答錯了！
      setErrorCount((prev) => prev + 1);
      setIsCurrentError(true); // 標記目前狀態為錯誤 (UI 可以變紅)

      triggerErrorSound();
    }
  }, [cursor, targetText, triggerKeySound, triggerErrorSound]);

  // 綁定與解綁鍵盤事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    cursor,
    errorCount,
    isCurrentError,
    reset,
    // 計算進度百分比 (0 ~ 100)
    progress: (cursor / targetText.length) * 100,
    // 是否完成
    isFinished: cursor === targetText.length && targetText.length > 0
  };
}