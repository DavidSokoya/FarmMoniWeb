import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    // If we are not on the homepage, go there first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If we are already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             {/* Make sure farmmoni-logo.png is in your public folder */}
             <img 
              src="/farmmoni-logo.png" 
              alt="FarmMoni Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Farm<span className="text-primary-600">Moni</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </button>
            
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              How it Works
            </button>
            
            <Link to="/marketplace" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Investments
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-semibold text-gray-900 hidden lg:block">{user.name}</span>
                <Button onClick={() => navigate('/dashboard')} size="sm">
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link to="/login" className="text-gray-900 font-semibold hover:text-primary-600">
                  Log in
                </Link>
                <Link to="/register">
                  <Button>
                    Get Started <ArrowRight size={16} className="ml-2 inline" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="block w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-900"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-900"
            >
              How it Works
            </button>
            <Link to="/marketplace" className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-900">
              Investments
            </Link>
            
            <div className="pt-4 border-t border-gray-100 mt-2">
              {user ? (
                <Button fullWidth onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="block text-center font-semibold text-gray-600">Log in</Link>
                  <Link to="/register">
                    <Button fullWidth>Create Account</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;