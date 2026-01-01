import { useEffect, useState } from 'react';

// 定義完整的鍵盤對應表
// 每顆按鍵包含: 
// default: 未按 Shift 的值
// shift: 按下 Shift 的值
// code: 對應的鍵盤事件 code (用來比對位置)
// width: 特殊按鍵的寬度 (CSS class)
const KEYBOARD_LAYOUT = [
  // --- 第一排: 數字與符號 ---
  [
    { default: '`', shift: '~', code: 'Backquote' },
    { default: '1', shift: '!', code: 'Digit1' },
    { default: '2', shift: '@', code: 'Digit2' },
    { default: '3', shift: '#', code: 'Digit3' },
    { default: '4', shift: '$', code: 'Digit4' },
    { default: '5', shift: '%', code: 'Digit5' },
    { default: '6', shift: '^', code: 'Digit6' },
    { default: '7', shift: '&', code: 'Digit7' },
    { default: '8', shift: '*', code: 'Digit8' },
    { default: '9', shift: '(', code: 'Digit9' },
    { default: '0', shift: ')', code: 'Digit0' },
    { default: '-', shift: '_', code: 'Minus' },
    { default: '=', shift: '+', code: 'Equal' },
    { label: 'Backspace', code: 'Backspace', width: 'w-20', isSpecial: true }
  ],
  // --- 第二排: QWERTY ---
  [
    { label: 'Tab', code: 'Tab', width: 'w-14', isSpecial: true },
    { default: 'q', shift: 'Q', code: 'KeyQ' },
    { default: 'w', shift: 'W', code: 'KeyW' },
    { default: 'e', shift: 'E', code: 'KeyE' },
    { default: 'r', shift: 'R', code: 'KeyR' },
    { default: 't', shift: 'T', code: 'KeyT' },
    { default: 'y', shift: 'Y', code: 'KeyY' },
    { default: 'u', shift: 'U', code: 'KeyU' },
    { default: 'i', shift: 'I', code: 'KeyI' },
    { default: 'o', shift: 'O', code: 'KeyO' },
    { default: 'p', shift: 'P', code: 'KeyP' },
    { default: '[', shift: '{', code: 'BracketLeft' },
    { default: ']', shift: '}', code: 'BracketRight' },
    { default: '\\', shift: '|', code: 'Backslash' }
  ],
  // --- 第三排: ASDF ---
  [
    { label: 'Caps', code: 'CapsLock', width: 'w-16', isSpecial: true },
    { default: 'a', shift: 'A', code: 'KeyA' },
    { default: 's', shift: 'S', code: 'KeyS' },
    { default: 'd', shift: 'D', code: 'KeyD' },
    { default: 'f', shift: 'F', code: 'KeyF' },
    { default: 'g', shift: 'G', code: 'KeyG' },
    { default: 'h', shift: 'H', code: 'KeyH' },
    { default: 'j', shift: 'J', code: 'KeyJ' },
    { default: 'k', shift: 'K', code: 'KeyK' },
    { default: 'l', shift: 'L', code: 'KeyL' },
    { default: ';', shift: ':', code: 'Semicolon' },
    { default: "'", shift: '"', code: 'Quote' },
    { label: 'Enter', code: 'Enter', width: 'w-20', isSpecial: true }
  ],
  // --- 第四排: ZXCV ---
  [
    { label: 'Shift', code: 'ShiftLeft', width: 'w-24', isSpecial: true },
    { default: 'z', shift: 'Z', code: 'KeyZ' },
    { default: 'x', shift: 'X', code: 'KeyX' },
    { default: 'c', shift: 'C', code: 'KeyC' },
    { default: 'v', shift: 'V', code: 'KeyV' },
    { default: 'b', shift: 'B', code: 'KeyB' },
    { default: 'n', shift: 'N', code: 'KeyN' },
    { default: 'm', shift: 'M', code: 'KeyM' },
    { default: ',', shift: '<', code: 'Comma' },
    { default: '.', shift: '>', code: 'Period' },
    { default: '/', shift: '?', code: 'Slash' },
    { label: 'Shift', code: 'ShiftRight', width: 'w-24', isSpecial: true }
  ]
];

export default function VirtualKeyboard({ nextChar, isError }) {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isShiftActive, setIsShiftActive] = useState(false);

  // 輔助: 判斷是否需要按 Shift (如果是大寫字母或特殊符號)
  const needsShift = (char) => {
    if (!char) return false;
    // 檢查是否在我們的鍵盤設定中的 'shift' 屬性裡
    return KEYBOARD_LAYOUT.some(row => 
      row.some(key => key.shift === char && key.default !== char)
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 記錄按下的鍵 (使用 e.code 來區分左右 Shift)
      setPressedKeys(prev => new Set(prev).add(e.code));
      if (e.key === 'Shift') setIsShiftActive(true);
    };

    const handleKeyUp = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
      if (e.key === 'Shift') setIsShiftActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyStyle = (keyConfig) => {
    const isPressed = pressedKeys.has(keyConfig.code);
    
    // 判斷這顆鍵是否該被提示 (綠色)
    let isExpected = false;
    
    if (nextChar) {
      // 情況 1: 它是目標字元本身 (例如 'a' 或 '1')
      if (keyConfig.default === nextChar) isExpected = true;
      // 情況 2: 它是目標字元的 Shift 版 (例如 'A' 或 '!')
      if (keyConfig.shift === nextChar) isExpected = true;
      // 情況 3: 目標字元需要 Shift，而這顆鍵是 Shift 鍵
      if (needsShift(nextChar) && keyConfig.label === 'Shift') isExpected = true;
    }

    // 基礎樣式
    let style = `m-1 flex flex-col items-center justify-center rounded shadow-md transition-all duration-75 border-b-4 select-none `;
    
    // 寬度設定
    style += keyConfig.width ? keyConfig.width : "w-10 h-12";

    // 狀態變色邏輯
    if (isPressed) {
      // 按下去
      style += " translate-y-1 border-b-0 shadow-none ";
      if (isError) {
        style += " bg-red-500 text-white border-red-700";
      } else {
        style += " bg-gray-600 text-white border-gray-800";
      }
    } else if (isExpected) {
      // 提示下一顆
      style += " bg-green-100 text-green-700 border-green-300";
    } else {
      // 閒置
      style += " bg-white text-gray-700 border-gray-300";
    }

    return style;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-xl mt-8 shadow-inner border border-gray-300">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((keyConfig) => (
            <div key={keyConfig.code} className={getKeyStyle(keyConfig)}>
              {/* 顯示邏輯: 如果是特殊鍵(Shift, Tab)顯示 Label，否則顯示主/副字符 */}
              {keyConfig.isSpecial ? (
                <span className="text-xs font-bold">{keyConfig.label}</span>
              ) : (
                <>
                  {/* 上方字符 (Shift) */}
                  <span className="text-[10px] text-gray-400 leading-none mb-1">
                    {keyConfig.shift}
                  </span>
                  {/* 下方字符 (Default) */}
                  <span className={`text-base font-bold leading-none ${isShiftActive ? 'text-gray-400' : 'text-gray-800'}`}>
                    {/* 如果現在按住 Shift，可以選擇強調上方字符，這裡我們先維持顯示 Default 字符但變色 */}
                    {keyConfig.default.toUpperCase()}
                  </span>
                </>
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