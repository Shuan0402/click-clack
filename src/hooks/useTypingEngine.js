import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useTypewriterSound from './useTypewriterSound';

export default function useTypingEngine(targetText) {
  const [cursor, setCursor] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isCurrentError, setIsCurrentError] = useState(false);
  
  // [新增] 計時相關狀態
  const [startTime, setStartTime] = useState(null); // 開始時間
  const [endTime, setEndTime] = useState(null);     // 結束時間
  
  const { triggerKeySound, triggerErrorSound } = useTypewriterSound();

  const stateRef = useRef({
    cursor: 0,
    targetText: targetText,
    startTime: null, // 用 Ref 紀錄避免閉包問題
    isFinished: false
  });

  // 當文章重置時
  useEffect(() => {
    stateRef.current.targetText = targetText;
    stateRef.current.cursor = 0;
    stateRef.current.startTime = null;
    stateRef.current.isFinished = false;
    setStartTime(null);
    setEndTime(null);
  }, [targetText]);

  const reset = useCallback(() => {
    setCursor(0);
    setErrorCount(0);
    setIsCurrentError(false);
    setStartTime(null);
    setEndTime(null);
    stateRef.current.cursor = 0;
    stateRef.current.startTime = null;
    stateRef.current.isFinished = false;
  }, []);

  const handleKeyDown = useCallback((e) => {
    const { cursor: currentCursor, targetText: currentText, isFinished } = stateRef.current;

    if (isFinished) return;
    if (currentCursor >= currentText.length) return;

    // [新增] 第一次按鍵時，啟動計時器
    if (!stateRef.current.startTime) {
      const now = Date.now();
      stateRef.current.startTime = now;
      setStartTime(now);
    }

    const key = e.key;
    const targetChar = currentText[currentCursor];

    if (key.length > 1 && key !== 'Backspace') return;

    if (key === targetChar) { // 這裡建議不要用 toLowerCase()，練習通常要求大小寫精確
      // 正確
      const nextCursor = currentCursor + 1;
      setCursor(nextCursor);
      stateRef.current.cursor = nextCursor; // 同步 Ref
      setIsCurrentError(false);
      triggerKeySound();

      // [新增] 檢查是否打完了
      if (nextCursor === currentText.length) {
        const finishTime = Date.now();
        setEndTime(finishTime);
        stateRef.current.isFinished = true;
      }
    } else {
      // 錯誤
      setErrorCount(prev => prev + 1);
      setIsCurrentError(true);
      triggerErrorSound();
    }
  }, [triggerKeySound, triggerErrorSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // [新增] 計算並回傳統計數據
  const totalTimeInSeconds = (endTime && startTime) ? (endTime - startTime) / 1000 : 0;
  
  // WPM 公式：(總字數 / 5) / 分鐘數
  // 避免除以 0
  const wpm = totalTimeInSeconds > 0 
    ? Math.round((targetText.length / 5) / (totalTimeInSeconds / 60)) 
    : 0;

  const accuracy = cursor > 0 
    ? Math.round(((cursor - errorCount) / cursor) * 100) 
    : 100;

  const stats = useMemo(() => {
    return {
      wpm,
      accuracy: Math.max(0, accuracy),
      timeElapsed: totalTimeInSeconds,
      errorCount
    };
  }, [wpm, accuracy, totalTimeInSeconds, errorCount]);

  return {
    cursor,
    errorCount,
    isCurrentError,
    reset,
    isFinished: cursor === targetText.length && targetText.length > 0,
    stats // 回傳穩定的 stats
  };
}