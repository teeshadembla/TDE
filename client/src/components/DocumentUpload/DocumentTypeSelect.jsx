// DocumentTypeSelect.jsx
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const DocumentTypeSelect = ({ 
  label = "Document Type", 
  selectedType, 
  onChange, 
  required = false, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const documentTypes = [
    { id: 'Report', name: 'Report' },
    { id: 'Opinion Piece', name: 'Opinion Piece' },
    { id: 'Policy Paper', name: 'Policy Paper' },
    { id: 'Position Paper', name: 'Position Paper' },
    { id: 'Industry Insight', name: 'Industry Insight' },
    { id: 'Research Article', name: 'Research Article' },
  ];

  const selectedOption = documentTypes.find(type => type.id === selectedType);

  const handleSelect = (typeId) => {
    onChange(typeId);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <label className="block text-white text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white cursor-pointer hover:border-[#004AAD] transition-all duration-200 flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-neutral-400'}>
          {selectedOption ? selectedOption.name : `Select ${label.toLowerCase()}`}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {isOpen && !disabled && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute z-20 w-full mt-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {documentTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className="px-4 py-3 hover:bg-neutral-800 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <span className="text-white text-sm group-hover:text-[#004AAD] transition-colors">
                  {type.name}
                </span>
                {selectedType === type.id && (
                  <Check className="w-4 h-4 text-[#004AAD]" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentTypeSelect;