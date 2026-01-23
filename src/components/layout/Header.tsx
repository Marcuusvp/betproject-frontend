import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, BarChart3 } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-dark-800 to-dark-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">⚽</span>
            </div>
            <span className="text-xl font-bold">BetProject</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-dark-600'
              }`}
            >
              <Home size={20} />
              <span className="hidden md:inline">Home</span>
            </Link>

            <Link
              to="/live"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/live')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-dark-600'
              }`}
            >
              <TrendingUp size={20} />
              <span className="hidden md:inline">Ao Vivo</span>
            </Link>

            <Link
              to="/statistics"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/statistics')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-dark-600'
              }`}
            >
              <BarChart3 size={20} />
              <span className="hidden md:inline">Estatísticas</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;