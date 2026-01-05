import { create } from 'zustand';

const useGameStore = create((set) => ({
  // --- 設定相關 ---
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  
  // --- 遊戲參數 ---
  targetText: "The quick brown fox jumps over the lazy dog.", // 預設文字
  setTargetText: (text) => set({ targetText: text }),
  
  gameMode: 'time', // 'time' or 'endless'
  setGameMode: (mode) => set({ gameMode: mode }),
  
  timeLimit: 60, // 預設 60秒
  setTimeLimit: (time) => set({ timeLimit: time }),

  // --- 遊戲結果 (新增這部分) ---
  gameResults: {
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    mode: 'time'
  },
  setGameResults: (results) => set({ gameResults: results }),
}));

export default useGameStore;