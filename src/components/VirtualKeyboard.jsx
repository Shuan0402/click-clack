import { useEffect, useState, useMemo } from 'react';
import { KEYBOARD_LAYOUT, getCodeByChar } from '../constants/keyboardData';
import useGameStore from '../store/useGameStore';

export default function VirtualKeyboard({ nextChar, isError }) {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const { language } = useGameStore(); // 取得全域語系

  useEffect(() => {
    const handleKeyDown = (e) => setPressedKeys(prev => new Set(prev).add(e.code));
    const handleKeyUp = (e) => setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 核心改進：判斷哪顆鍵該亮
  const expectedKeyCode = useMemo(() => getCodeByChar(nextChar), [nextChar]);

  const getKeyStyle = (keyConfig) => {
    const isPressed = pressedKeys.has(keyConfig.code);
    const isExpected = expectedKeyCode === keyConfig.code;
    const isShiftKey = keyConfig.label === 'Shift';
    
    // 如果目標字元是大寫或符號，且這顆是 Shift 鍵，也要亮
    const needsShift = /[A-Z!@#$%^&*()_+{}:"<>?]/.test(nextChar);
    const shouldHighlightShift = isShiftKey && needsShift;

    let style = `m-1 flex flex-col items-center justify-center rounded shadow-md transition-all duration-75 border-b-4 select-none ${
      keyConfig.width || "w-10 h-12"
    } `;

    if (isPressed) {
      style += isError ? "bg-red-500 text-white translate-y-1 border-b-0" : "bg-gray-600 text-white translate-y-1 border-b-0";
    } else if (isExpected || shouldHighlightShift) {
      style += "bg-green-100 text-green-700 border-green-300 scale-105 z-10";
    } else {
      style += "bg-white text-gray-700 border-gray-300";
    }
    return style;
  };

  return (
    <div className="p-4 bg-gray-200 rounded-xl mt-8 shadow-inner border border-gray-300 font-sans">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((key) => (
            <div key={key.code} className={getKeyStyle(key)}>
              {key.isSpecial ? (
                <span className="text-[10px] font-bold uppercase">{key.label}</span>
              ) : (
                <div className="flex flex-col items-center">
                  {/* 注音模式：主顯示注音，副顯示英文 */}
                  {language === 'zh-TW' ? (
                    <>
                      <span className="text-[9px] text-gray-400">{key.default.toUpperCase()}</span>
                      <span className="text-lg font-black text-blue-600">{key.zh}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] text-gray-400">{key.shift}</span>
                      <span className="text-base font-bold">{key.default.toUpperCase()}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      
      {/* 空白鍵 */}
      <div className="flex mt-1">
        <div className={`w-80 h-10 flex items-center justify-center rounded shadow-md border-b-4 transition-all duration-75
          ${pressedKeys.has('Space')
            ? 'translate-y-1 border-b-0 shadow-none bg-gray-600 border-gray-800' 
            : 'bg-white border-gray-300'}
          ${nextChar === ' ' ? 'bg-green-100 border-green-300' : ''}
        `}>
          SPACE
        </div>
      </div>
    </div>
  );
}