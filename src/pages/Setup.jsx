import { Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';

export default function Setup() {
  const { isSoundEnabled, toggleSound } = useGameStore();

  return (
    <div className="p-8 bg-amber-50 h-screen">
      <h2 className="text-3xl font-mono mb-4">Setup</h2>

      <div className="mb-6">
        <button 
          onClick={toggleSound}
          className={`px-4 py-2 rounded border ${isSoundEnabled ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}
        >
          Sound: {isSoundEnabled ? 'ON 🔊' : 'OFF 🔇'}
        </button>
      </div>

      <Link to="/practice" className="px-6 py-3 bg-gray-800 text-white rounded">
        Go to Practice
      </Link>
    </div>
  );
}