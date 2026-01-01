import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Practice from './pages/Practice';
import Result from './pages/Result';

function App() {
  return (
    // 使用 HashRouter 是為了方便部署到 GitHub Pages
    <Router>
      <div className="min-h-screen font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;