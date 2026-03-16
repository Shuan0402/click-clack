// src/constants/keyboardData.js

export const KEYBOARD_LAYOUT = [
  // --- 第一排: 數字、符號與注音聲調 ---
  [
    { default: '`', shift: '~', zh: '', code: 'Backquote' },
    { default: '1', shift: '!', zh: 'ㄅ', code: 'Digit1' },
    { default: '2', shift: '@', zh: 'ㄉ', code: 'Digit2' },
    { default: '3', shift: '#', zh: 'ˇ', code: 'Digit3' },
    { default: '4', shift: '$', zh: 'ˋ', code: 'Digit4' },
    { default: '5', shift: '%', zh: 'ㄓ', code: 'Digit5' },
    { default: '6', shift: '^', zh: 'ˊ', code: 'Digit6' },
    { default: '7', shift: '&', zh: '˙', code: 'Digit7' },
    { default: '8', shift: '*', zh: 'ㄚ', code: 'Digit8' },
    { default: '9', shift: '(', zh: 'ㄞ', code: 'Digit9' },
    { default: '0', shift: ')', zh: 'ㄢ', code: 'Digit0' },
    { default: '-', shift: '_', zh: 'ㄦ', code: 'Minus' },
    { default: '=', shift: '+', zh: '', code: 'Equal' },
    { label: 'Backspace', code: 'Backspace', width: 'w-20', isSpecial: true }
  ],
  // --- 第二排: Q-P 與介音 ---
  [
    { label: 'Tab', code: 'Tab', width: 'w-14', isSpecial: true },
    { default: 'q', shift: 'Q', zh: 'ㄆ', code: 'KeyQ' },
    { default: 'w', shift: 'W', zh: 'ㄊ', code: 'KeyW' },
    { default: 'e', shift: 'E', zh: 'ㄍ', code: 'KeyE' },
    { default: 'r', shift: 'R', zh: 'ㄐ', code: 'KeyR' },
    { default: 't', shift: 'T', zh: 'ㄔ', code: 'KeyT' },
    { default: 'y', shift: 'Y', zh: 'ㄗ', code: 'KeyY' },
    { default: 'u', shift: 'U', zh: 'ㄧ', code: 'KeyU' },
    { default: 'i', shift: 'I', zh: 'ㄛ', code: 'KeyI' },
    { default: 'o', shift: 'O', zh: 'ㄟ', code: 'KeyO' },
    { default: 'p', shift: 'P', zh: 'ㄣ', code: 'KeyP' },
    { default: '[', shift: '{', zh: '『', code: 'BracketLeft' },
    { default: ']', shift: '}', zh: '』', code: 'BracketRight' },
    { default: '\\', shift: '|', zh: '', code: 'Backslash' }
  ],
  // --- 第三排: A-L 與韻母 ---
  [
    { label: 'Caps', code: 'CapsLock', width: 'w-16', isSpecial: true },
    { default: 'a', shift: 'A', zh: 'ㄇ', code: 'KeyA' },
    { default: 's', shift: 'S', zh: 'ㄋ', code: 'KeyS' },
    { default: 'd', shift: 'D', zh: 'ㄎ', code: 'KeyD' },
    { default: 'f', shift: 'F', zh: 'ㄑ', code: 'KeyF' },
    { default: 'g', shift: 'G', zh: 'ㄕ', code: 'KeyG' },
    { default: 'h', shift: 'H', zh: 'ㄘ', code: 'KeyH' },
    { default: 'j', shift: 'J', zh: 'ㄨ', code: 'KeyJ' },
    { default: 'k', shift: 'K', zh: 'ㄜ', code: 'KeyK' },
    { default: 'l', shift: 'L', zh: 'ㄠ', code: 'KeyL' },
    { default: ';', shift: ':', zh: 'ㄤ', code: 'Semicolon' },
    { default: "'", shift: '"', zh: '', code: 'Quote' },
    { label: 'Enter', code: 'Enter', width: 'w-20', isSpecial: true }
  ],
  // --- 第四排: Z-M 與結合韻 ---
  [
    { label: 'Shift', code: 'ShiftLeft', width: 'w-24', isSpecial: true },
    { default: 'z', shift: 'Z', zh: 'ㄈ', code: 'KeyZ' },
    { default: 'x', shift: 'X', zh: 'ㄌ', code: 'KeyX' },
    { default: 'c', shift: 'C', zh: 'ㄏ', code: 'KeyC' },
    { default: 'v', shift: 'V', zh: 'ㄒ', code: 'KeyV' },
    { default: 'b', shift: 'B', zh: 'ㄖ', code: 'KeyB' },
    { default: 'n', shift: 'N', zh: 'ㄙ', code: 'KeyN' },
    { default: 'm', shift: 'M', zh: 'ㄩ', code: 'KeyM' },
    { default: ',', shift: '<', zh: 'ㄝ', code: 'Comma' },
    { default: '.', shift: '>', zh: 'ㄡ', code: 'Period' },
    { default: '/', shift: '?', zh: 'ㄥ', code: 'Slash' },
    { label: 'Shift', code: 'ShiftRight', width: 'w-24', isSpecial: true }
  ]
];

/**
 * 輔助函式：根據字元尋找對應的按鍵 Code
 * 支援尋找 Default 字符、Shift 字符以及注音符號
 */
export const getCodeByChar = (char) => {
  if (!char) return null;
  const target = char.toLowerCase();
  
  for (const row of KEYBOARD_LAYOUT) {
    for (const key of row) {
      // 1. 比對注音符號 (最高優先權)
      if (key.zh === char) return key.code;
      // 2. 比對一般字元
      if (key.default === target) return key.code;
      // 3. 比對 Shift 字元 (例如 '!' 對應 'Digit1')
      if (key.shift === char) return key.code;
    }
  }

  // 處理空白鍵的特殊情況
  if (char === ' ' || char === 'Space') return 'Space';
  
  return null;
};

/**
 * 輔助函式：判斷該字元是否需要按住 Shift
 */
export const needsShift = (char) => {
  if (!char) return false;
  // 大寫字母或是在 KEYBOARD_LAYOUT 中定義為 shift 的符號
  return KEYBOARD_LAYOUT.some(row => 
    row.some(key => key.shift === char && key.default !== char)
  );
};