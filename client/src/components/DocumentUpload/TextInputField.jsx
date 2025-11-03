import React from 'react';

const TextInputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false,
  maxLength,
  type = 'text'
}) => {
  return (
    <div className="w-full">
      <label className="block text-white text-sm font-semibold mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-[#004AAD] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {maxLength && (
        <p className="text-neutral-500 text-xs mt-1">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

export default TextInputField;