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

const AddFellowshipForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    cycle: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    requirements: ''
  });

  const cycles = [
    'January 2025', 'March 2025', 'June 2025', 'October 2025',
    'January 2026', 'March 2026', 'June 2026', 'October 2026'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if ( !formData.description || !formData.cycle) {
      alert('Please fill in all required fields');
      return;
    }
    try{
      onSubmit(formData);
      setFormData({
        description: '',
        cycle: '',
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        requirements: ''
      })
    }catch(error){
      console.log("This error occurred in the frontend while adding fellowships---->", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Fellowship</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cycle *</label>
            <input
              value={formData.cycle}
              onChange={(e) => setFormData(prev => ({ ...prev, cycle: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
            >
            </input>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none transition-colors"
              placeholder="Detailed description of the fellowship program..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
            <input
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none transition-colors"
              placeholder="List the fellowship requirements and expectations..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium rounded-lg"
          >
            Create Fellowship
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-black border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFellowshipForm;