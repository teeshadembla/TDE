import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus, Check, AlertCircle, CheckCircle } from 'lucide-react';

// Multi-Select Dropdown Component
const MultiSelect = ({ label, options, selectedIds, onChange, required, disabled, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(item => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedNames = options
    .filter(opt => selectedIds.includes(opt._id))
    .map(opt => opt.FullName);

  return (
    <div className="w-full relative">
      <label className="block text-white text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white cursor-pointer hover:border-[#004AAD] transition-all duration-200 ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <span className="text-neutral-400 text-sm">Loading...</span>
          ) : selectedNames.length > 0 ? (
            selectedNames.map((name, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#004AAD] text-white text-xs rounded-full flex items-center gap-1"
              >
                {name}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    const option = options.find(opt => opt.FullName === name);
                    if (option) toggleOption(option._id);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-neutral-400 text-sm">
              {disabled ? 'Select workgroup first' : `Select ${label.toLowerCase()}`}
            </span>
          )}
        </div>
      </div>

      {isOpen && !disabled && !loading && options.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option._id}
              onClick={() => toggleOption(option._id)}
              className="px-4 py-3 hover:bg-neutral-800 cursor-pointer flex items-center justify-between transition-colors"
            >
              <span className="text-white text-sm">{option.FullName}</span>
              {selectedIds.includes(option._id) && (
                <Check className="w-4 h-4 text-[#004AAD]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;