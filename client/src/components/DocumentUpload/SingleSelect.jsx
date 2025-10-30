import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus, Check, AlertCircle, CheckCircle } from 'lucide-react';

// Single Select Dropdown Component
const SingleSelect = ({ label, options, selectedId, onChange, required, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt._id === selectedId);

  return (
    <div className="w-full relative">
      <label className="block text-white text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div
        onClick={() => !loading && setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white cursor-pointer hover:border-[#004AAD] transition-all duration-200"
      >
        <span className={selectedOption ? 'text-white' : 'text-neutral-400'}>
          {loading ? 'Loading...' : selectedOption ? selectedOption.title : `Select ${label.toLowerCase()}`}
        </span>
      </div>

      {isOpen && !loading && options.length > 0 && (
        <div className="absolute text-white z-10 w-full mt-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option._id}
              onClick={() => {
                onChange(option._id);
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-neutral-800 cursor-pointer flex items-center text-white justify-between transition-colors"
            >
              <span className="text-white text-sm">{option.title}</span>
              {selectedId === option._id && (
                <Check className="w-4 h-4 text-[#004AAD]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;