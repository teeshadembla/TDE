import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  Users, 
  FileText, 
  Plus,
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  History,
  Target
} from 'lucide-react';

const PastFellowships = ({ fellowships, participantsCount = {} }) => { 
  return(
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Past Fellowships</h2>
      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {fellowships.map((fellowship) => (
        <div key={fellowship._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{fellowship.cycle}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{fellowship?.workgroupId?.description}</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              {fellowship?.workgroupId?.title}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Started: {new Date(fellowship.startDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {participantsCount[fellowship.cycle] || 0} participants
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed: {new Date(fellowship.endDate).toLocaleDateString()}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button className="w-full py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              View Details & Analytics
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default PastFellowships;