import { create } from 'zustand';

const useGameStore = create((set) => ({
  // --- 系統設定 ---
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  // --- 遊戲設定 ---
  gameMode: 'time', // 'time' | 'endless'
  setGameMode: (mode) => set({ gameMode: mode }),

  timeLimit: 60,
  setTimeLimit: (seconds) => set({ timeLimit: seconds }),

  // --- 文章內容 ---
  targetText: '', 
  setTargetText: (text) => set({ targetText: text }),

  // --- [新增] 遊戲結算成績 ---
  gameResults: {
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    errorCount: 0,
    totalChars: 0
  },
  setGameResults: (results) => set({ gameResults: results }),
}));

export default useGameStore;