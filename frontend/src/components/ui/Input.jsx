import React from 'react';

const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        onWheel={(e) => e.target.blur()}
        className="
          w-full px-4 py-3 
          bg-gray-800 
          border border-gray-700 
          text-white placeholder-gray-500
          rounded-lg 
          focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          transition-colors
        "
        style={{ colorScheme: 'dark' }} 
        {...props} 
      />
    </div>
  );
};

export default Input;