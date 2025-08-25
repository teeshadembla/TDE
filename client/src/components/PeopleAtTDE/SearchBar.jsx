import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

// Search Bar Component
const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="relative">
    <Search className="text-black absolute left-3 top-1/2 transform -translate-y-1/2 " size={20} />
    <input
      type="text"
      placeholder="Search by name, position, or specialization..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black placeholder-gray-500"
    />
  </div>
);

export default SearchBar;