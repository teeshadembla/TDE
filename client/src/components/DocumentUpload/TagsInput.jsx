import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus, Check, AlertCircle, CheckCircle } from 'lucide-react';
// Tags Input Component
const TagsInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-white text-sm font-semibold mb-2">
        Tags
      </label>
      <div className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg focus-within:border-[#004AAD] transition-all duration-200">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[#004AAD] text-white text-xs rounded-full flex items-center gap-1"
            >
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-300"
                onClick={() => removeTag(tag)}
              />
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter to add tags"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-neutral-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-[#004AAD]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsInput;