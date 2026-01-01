import useSound from 'use-sound';
import useGameStore from '../store/useGameStore';

// 引入你的音效檔 (請確認檔名跟這裡一致)
import keyPressSfx from '../assets/sounds/key-press.mp3';
import keyErrorSfx from '../assets/sounds/key-error.mp3';

export default function useTypewriterSound() {
  // 1. 從 Store 取得全域音效開關
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);

  // 2. 初始化音效
  // volume: 音量 (0~1)
  // sprite: 如果你想用一張大音效表，可以用這個，但現在我們先讀單檔
  const [playKey] = useSound(keyPressSfx, { volume: 0.6 });
  const [playError] = useSound(keyErrorSfx, { volume: 0.5 });

  // 3. 封裝播放函式
  const triggerKeySound = () => {
    if (!isSoundEnabled) return;
    
    // 💡 小技巧：加上些微的隨機音調 (Pitch)，讓打字聲聽起來更像真實機械，而不是機關槍
    // playbackRate 範圍: 0.95 ~ 1.05
    playKey({ playbackRate: 0.95 + Math.random() * 0.1 });
  };

  const triggerErrorSound = () => {
    if (!isSoundEnabled) return;
    playError();
  };

  return { triggerKeySound, triggerErrorSound };
}