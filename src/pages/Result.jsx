import { Link } from 'react-router-dom';

export default function Result() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-50">
      <h2 className="text-4xl font-mono mb-6">Results</h2>
      <p className="text-xl mb-8">WPM: 0 | Accuracy: 0%</p>
      <div className="space-x-4">
        <Link to="/setup" className="px-6 py-3 bg-gray-200 rounded">Retry</Link>
        <Link to="/" className="px-6 py-3 bg-gray-800 text-white rounded">Home</Link>
      </div>
    </div>
  );
}