import React from 'react';

const Input = ({ label, type, placeholder, value, onChange, icon: Icon }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700 block">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block p-3 ${Icon ? 'pl-10' : ''} transition-all duration-200 shadow-sm`}
        />
      </div>
    </div>
  );
};

export default Input;