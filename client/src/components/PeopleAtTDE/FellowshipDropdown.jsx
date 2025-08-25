import React, { useState, useMemo } from 'react';
import { ChevronDown} from 'lucide-react';

// Fellowship Dropdown Component
const FellowshipDropdown = ({ selectedYear, onYearChange, years }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between gap-2 bg-white hover:bg-gray-50 transition-colors"
      >
        <span>Fellowship {selectedYear}</span>
        <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:right-auto md:w-48 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                setIsOpen(false);
              }}
              className="w-full text-black text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              Fellowship {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FellowshipDropdown;  