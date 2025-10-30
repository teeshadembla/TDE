import React, { useState, useMemo } from 'react';
import { MapPin, Calendar, FileText, Award } from 'lucide-react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


// Person Card Component
const PersonCard = ({ person, onClick }) => {
        
    return(
        <div className="w-full max-w-sm mx-auto bg-neutral-800 rounded-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
                <img 
                    src={person.profilePicture} 
                    alt={person.FullName}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h1 className="font-sans cursor-pointer font-bold text-lg mb-2 text-white hover:text-gray-300 transition-colors">
                    {person.FullName}
                </h1>
                <p className="text-[#9f9f9f] text-xs font-normal font-sans mb-4 leading-relaxed">
                    {person.title}
                </p>
                <button onClick={onClick} className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 p-2 rounded-[4px] w-full flex items-center justify-center gap-2 text-white transition-colors text-sm">
                    View Profile 
                    <ArrowOutwardIcon className="text-sm"/>
                </button>
            </div>
        </div>
    )
}

export default PersonCard;