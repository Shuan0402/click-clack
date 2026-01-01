import { Link } from 'react-router-dom';

export default function Practice() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-100">
      <h2 className="text-2xl font-mono mb-4">Typing Arena</h2>
      <div className="w-3/4 h-64 border-2 border-gray-400 p-4 mb-4 bg-white shadow-inner">
        {/* 這裡未來會是打字機滾動區 */}
        <p className="text-gray-400">Waiting for text...</p>
      </div>
      <Link to="/result" className="text-blue-600 underline">Finish (Debug)</Link>
    </div>
  );
}