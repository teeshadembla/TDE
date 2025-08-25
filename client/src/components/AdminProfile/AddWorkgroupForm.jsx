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
import { toast } from 'react-toastify';

const AddWorkgroupForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researchFocus: '',
    maxMembers: '',
    slackChannelName: '',
    coordinator: '',
    objectives: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.title || !formData.description || !formData.maxMembers || !formData.slackChannelName || !formData.coordinator) {
      toast.info('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
    title: '',
    description: '',
    researchFocus: '',
    maxMembers: '',
    slackChannelName: '',
    coordinator: '',
    objectives: ''
  })
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Workgroup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Workgroup Name *</label>
            <input
              type="text"
              name='title'
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="e.g., Artificial Intelligence Ethics"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none transition-colors"
              placeholder="Detailed description of the workgroup's purpose and activities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Research Focus</label>
            <input
              type="text"
              value={formData.researchFocus}
              onChange={(e) => setFormData(prev => ({ ...prev, researchFocus: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="Primary research area"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Members</label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="12"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slack Channel Name</label>
            <input
              type="text"
              value={formData.slackChannelName}
              onChange={(e) => setFormData(prev => ({ ...prev, slackChannelName: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="ai-ethics-research"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator Email</label>
            <input
              type="email"
              value={formData.coordinator}
              onChange={(e) => setFormData(prev => ({ ...prev, coordinator: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="coordinator@thinktank.org"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
            <textarea
              rows={3}
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              className="text-black w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none transition-colors"
              placeholder="Key objectives and goals for this workgroup..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium rounded-lg"
          >
            Create Workgroup
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-black px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkgroupForm;