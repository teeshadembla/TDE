import React, { useState, useEffect } from 'react';
import { User, Calendar, Users, ExternalLink, Award, Clock, Mail, ChevronRight, Plus, BookOpen, Target, Globe, FileText, AlertCircle, MessageCircle } from 'lucide-react';
import { useContext } from 'react';
import DataProvider from "../../context/DataProvider.jsx";

const ProfileSidebar = ({ user, currentRegistrations, pastRegistrations }) => {
    const {account, setAccount} = useContext(DataProvider.DataContext);

  const totalResearchPapers = [...currentRegistrations, ...pastRegistrations]
    .reduce((total, reg) => total + (reg.workgroup?.researchPapers?.length || 0), 0);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
      <div className="text-center mb-6">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-100"
        />
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{account.name}</h2>
        <p className="text-gray-600 text-sm flex items-center justify-center">
          <Mail className="w-4 h-4 mr-2" />
          {account.email}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Fellowship Stats
          </h3>
          <div className="space-y-2 text-sm">
            {/* Write api to fetch active fellowships of this user */}
            <div className="flex justify-between">
              <span className="text-gray-600">Active Fellowships</span>
              <span className="font-medium text-gray-600">{currentRegistrations?.length}</span>
            </div>
            {/* Write api to fetch past fellowships */}
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-gray-600">{pastRegistrations?.length}</span>
            </div>

            {/* write api to get research papers */}
            <div className="flex justify-between">
              <span className="text-gray-600">Research Papers</span>
              <span className="font-medium text-gray-600">{totalResearchPapers}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <a href="/execFellowship" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-between group">
              Browse Fellowships
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/centreForExcellence" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-between group">
              Research Library
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/support" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-between group">
              Contact Support
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </h3>
          <div className="space-y-2">
            <a href="https://docsend.com/view/3guztqkd7w69i7a4" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:text-blue-900 flex items-center justify-between group">
              Fellow Handbook
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="/research-guidelines" className="text-sm text-blue-700 hover:text-blue-900 flex items-center justify-between group">
              Research Guidelines
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfileSidebar;