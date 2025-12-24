import {create} from 'zustand';

export const useGameStore = create((set) => ({
    // 系統設定
    isSoundEnabled: true,
    toggleSound: () => set((state) => ({isSoundEnabled: !state.isSoundEnabled})),

    // 練習設定
    language: 'en',
    setLanguage: (lang) => set({language: lang}),

    mode: 'time',
    timeLimit: 60,

    articleContent: '',
    setArticleContent: (content) => set({articleContent: content}),

    // 遊戲狀態
    wpm: 0,
    accuracy: 0,
    setResult: (wpm, accuracy) => set({wpm, accuracy}),
}));

export default useGameStore;