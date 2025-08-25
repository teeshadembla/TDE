import React, { useState, useMemo } from 'react';
import { MapPin, Calendar, FileText, Award } from 'lucide-react';

// Person Card Component
const PersonCard = ({ person, onClick }) => (
  <div 
    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    onClick={() => onClick(person)}
  >
    <div className="text-center">
      <img 
        src={person.image} 
        alt={person.FullName}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-100 group-hover:border-gray-300 transition-colors"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{person.FullName}</h3>
      <p className="text-gray-600 mb-3">{person.title}</p>
      
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-1">
          <MapPin size={14} />
          <span>{person.location}</span>
        </div>
        
        {person.createdAt && (
          <div className="flex items-center justify-center gap-1">
            <Calendar size={14} />
            <span>Since {person.createdAt}</span>
          </div>
        )}
        
        {person.fellowship && (
          <div className="flex items-center justify-center gap-1">
            <Award size={14} />
            <span>Fellow {person.fellowship}</span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-1">
          <FileText size={14} />
          <span>{person.publications} Publications</span>
        </div>
      </div>
      
      {person.expertise && (
        <div className="mt-3">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {person.expertise.map((exp, index) => (
              <span key={index} className="mr-1">
                {exp}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default PersonCard;