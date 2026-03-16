import { create } from 'zustand';

const useGameStore = create((set) => ({
  // --- 設定相關 ---
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  
  // --- 遊戲參數 ---
  targetText: "The quick brown fox jumps over the lazy dog.",
  setTargetText: (text) => set({ targetText: text }),
  
  gameMode: 'time',
  setGameMode: (mode) => set({ gameMode: mode }),
  
  timeLimit: 60,
  setTimeLimit: (time) => set({ timeLimit: time }),

  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  // --- 遊戲結果 ---
  gameResults: {
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    mode: 'time'
  },
  setGameResults: (results) => set({ gameResults: results }),
}));

export default useGameStore;