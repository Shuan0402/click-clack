import { create } from 'zustand';

const useGameStore = create((set) => ({
  // --- 系統設定 ---
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  // --- 遊戲設定 ---
  gameMode: 'time', // 'time' (倒數模式) | 'endless' (正計時/打完為止)
  setGameMode: (mode) => set({ gameMode: mode }),

  timeLimit: 60, // 單位：秒
  setTimeLimit: (seconds) => set({ timeLimit: seconds }),

  // --- 文章內容 ---
  targetText: '', 
  setTargetText: (text) => set({ targetText: text }),

  // --- 遊戲結果 (暫存) ---
  results: { wpm: 0, accuracy: 0 },
  setResults: (data) => set({ results: data }),
}));

export default useGameStore;