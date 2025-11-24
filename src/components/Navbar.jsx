import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">Price Tracker</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            <Link
              to="/favoritos"
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                isActive('/favoritos') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart size={20} />
              <span>Favoritos</span>
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

