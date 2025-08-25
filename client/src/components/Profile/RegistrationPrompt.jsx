import React, { useState, useEffect } from 'react';
import { User, Calendar, Users, ExternalLink, Award, Clock, Mail, ChevronRight, Plus, BookOpen, Target, Globe, FileText, AlertCircle, MessageCircle } from 'lucide-react';

const RegistrationPrompt = () => {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Fellowship Registrations</h3>
        <p className="text-gray-600 mb-6">
          You're not currently registered for any fellowship programs. Explore our executive fellowships to advance your research and career.
        </p>
        <a 
          href="/execFellowship" 
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Browse Available Fellowships
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default RegistrationPrompt;