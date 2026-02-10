import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  HiOutlineViewGrid,
  HiOutlineUser,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid className="w-5 h-5" /> },
    { to: '/profile', label: 'Profile', icon: <HiOutlineUser className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TD</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Todo</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-700 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center space-x-3 pb-3 mb-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-700 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
