import React from 'react';
import { Calendar } from 'lucide-react';

const DateInputField = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  max,
  min
}) => {
  return (
    <div className="w-full">
      <label className="block text-white text-sm font-semibold mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={max}
          min={min}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-[#004AAD] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark]"
        />
        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default DateInputField;