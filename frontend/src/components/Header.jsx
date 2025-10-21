import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-op-orange to-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <h1 className="text-4xl font-bold text-white text-center hover:scale-105 transition-transform cursor-pointer">
            🏴‍☠️ ONE PIECE VIEWER
          </h1>
          <p className="text-center text-white/90 mt-2">Navigate the Grand Line - Watch by Arc or Random Episode</p>
        </Link>
      </div>
    </header>
  );
};

export default Header;

