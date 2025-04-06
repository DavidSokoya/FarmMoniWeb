import React from 'react';

// Notice we added 'type = "button"' to the list below vvv
const Button = ({ children, onClick, isLoading, fullWidth, type = "button" }) => {
  return (
    <button
      type={type} // Now this variable exists!
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/20 
        text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
        transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;