// User Profile Component (simulates navigation to profile page)
import React, { useState, useMemo } from 'react';
import { MapPin, Calendar, FileText, ExternalLink,  Award } from 'lucide-react';

const UserProfile = ({ user, onBack }) => {
  const publications = [
    { title: "Digital Transformation in Modern Economics", year: "2024", coAuthors: ["Dr. Smith", "Prof. Wilson"] },
    { title: "The Future of Cryptocurrency Markets", year: "2023", coAuthors: ["Dr. Brown"] },
    { title: "AI Impact on Financial Services", year: "2023", coAuthors: ["Prof. Davis", "Dr. Lee"] }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-black transition-colors mb-8"
        >
          ← Back to Our People
        </button>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img 
                src={user.image} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-100"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-light mb-2">{user.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{user.position}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
                {user.joinDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Since {user.joinDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} />
                  <span>{user.publications} Publications</span>
                </div>
              </div>
              
              {user.bio && (
                <p className="text-gray-700 leading-relaxed mb-6">{user.bio}</p>
              )}
              
              {user.specialization && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    <Award size={14} className="mr-1" />
                    {user.specialization}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
              <FileText size={20} />
              Publications with Digital Economist
            </h2>
            
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{pub.title}</h3>
                    <span className="text-sm text-gray-500">{pub.year}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Co-authors: {pub.coAuthors.join(", ")}
                  </p>
                  <button className="mt-2 text-sm text-black hover:underline flex items-center gap-1">
                    Read Article <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
