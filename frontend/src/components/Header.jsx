import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-op-dark/95 backdrop-blur-md shadow-xl border-b-2 border-op-orange/30 w-full">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center space-x-3">
            <div className="text-4xl group-hover:scale-110 transition-transform">🏴‍☠️</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange to-yellow-400 group-hover:from-yellow-400 group-hover:to-op-orange transition-all">
                ONE PIECE VIEWER
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">Navigate the Grand Line</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isHome 
                  ? 'bg-op-orange text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-op-orange/20'
              }`}
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

