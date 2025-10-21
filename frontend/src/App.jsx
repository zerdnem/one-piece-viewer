import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ArcView from './pages/ArcView';
import Watch from './pages/Watch';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-op-dark to-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/arc/:arcId" element={<ArcView />} />
          <Route path="/watch/:episodeNumber" element={<Watch />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-op-dark border-t border-gray-800 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p className="mb-2">One Piece Viewer - Navigate the Grand Line</p>
            <p className="text-sm">
              Built with React + Tailwind CSS | Data from One Piece Wiki
            </p>
            <p className="text-xs mt-2 text-gray-500">
              For educational purposes. Video integration requires backend scraper implementation.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
