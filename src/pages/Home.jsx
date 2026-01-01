import {Link} from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-amber-50 text-gray-800">
            <h1 className="text-6xl font-bold mb-8 font-mono">ClickClack</h1>
            <div className="space-x-4">
                <Link to="/setup" className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
                Start Typing
                </Link>
            </div>
        </div>
    );
}