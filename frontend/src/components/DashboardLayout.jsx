import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Reusable Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          >
             <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
             <span className="text-xl font-bold text-gray-900 hidden sm:block">
               Farm<span className="text-primary-600">Moni</span>
             </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">
              Welcome, {user?.name}
            </span>
            <button 
              onClick={logout} 
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content goes here */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;