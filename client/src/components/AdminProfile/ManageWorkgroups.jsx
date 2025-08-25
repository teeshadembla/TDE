import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Calendar,
  ExternalLink,
  AlertCircle,
  Eye,
  Settings,
  Target,
  Globe,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/apiConfig';


const ManageWorkgroups = ({ onEdit, onDelete, onCreate }) => {
  const [workgroups, setWorkgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkgroup, setEditingWorkgroup] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    slackChannelUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchWorkgroups();
  }, []);

  const fetchWorkgroups = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await axiosInstance.get("/api/fellowship/getWorkgroups");
      console.log("These are all the workgroups fetched--->", response);
      setWorkgroups(response?.data?.data || []);
      
      // Sample data for demonstration
      const sampleData = [
        {
          _id: "wg1",
          title: "Climate Policy Research",
          description: "Advanced research on climate policy frameworks and implementation strategies for sustainable development.",
          slackChannelUrl: "https://workspace.slack.com/channels/climate-policy",
          isActive: true,
          participantCount: 15,
          researchPapersCount: 8,
          fellowshipsAssociated: [
            { title: "Climate Policy Initiative", cycle: "2024-Fall" },
            { title: "Environmental Leadership Program", cycle: "2024-Spring" }
          ],
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-08-10T00:00:00Z"
        },
        {
          _id: "wg2",
          title: "Digital Governance Lab",
          description: "Research and development of digital governance frameworks, policy innovations, and technology implementation in government.",
          slackChannelUrl: "https://workspace.slack.com/channels/digital-gov",
          isActive: true,
          participantCount: 22,
          researchPapersCount: 12,
          fellowshipsAssociated: [
            { title: "Digital Transformation Fellowship", cycle: "2024-Fall" },
            { title: "Government Innovation Program", cycle: "2024-Summer" }
          ],
          createdAt: "2024-02-01T00:00:00Z",
          updatedAt: "2024-07-28T00:00:00Z"
        },
        {
          _id: "wg3",
          title: "Economic Development Research",
          description: "Comprehensive analysis of economic development policies, market dynamics, and sustainable growth strategies.",
          slackChannelUrl: "",
          isActive: false,
          participantCount: 8,
          researchPapersCount: 5,
          fellowshipsAssociated: [
            { title: "Global Policy Fellowship", cycle: "2024-Spring" }
          ],
          createdAt: "2023-11-20T00:00:00Z",
          updatedAt: "2024-06-15T00:00:00Z"
        },
        {
          _id: "wg4",
          title: "International Relations Forum",
          description: "Strategic analysis of international relations, diplomatic frameworks, and global policy coordination mechanisms.",
          slackChannelUrl: "https://workspace.slack.com/channels/intl-relations",
          isActive: true,
          participantCount: 18,
          researchPapersCount: 15,
          fellowshipsAssociated: [
            { title: "International Relations Fellowship", cycle: "2023-Fall" },
            { title: "Diplomatic Studies Program", cycle: "2024-Winter" }
          ],
          createdAt: "2023-09-10T00:00:00Z",
          updatedAt: "2024-08-05T00:00:00Z"
        }
      ];
      
      /* setWorkgroups(sampleData); */
    } catch (error) {
      console.error('Error fetching workgroups:', error);
      toast.error('Failed to fetch workgroups');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (workgroup) => {
    setEditingWorkgroup(workgroup);
    setEditFormData({
      title: workgroup.title,
      description: workgroup.description,
      slackChannelUrl: workgroup.slackChannelUrl || '',
      isActive: workgroup.isActive
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Replace with your actual API call
      await axiosInstance.patch(`/api/fellowship/editWorkgroup/${editingWorkgroup._id}`, editFormData);
      
      setWorkgroups(prev => prev.map(wg => 
        wg._id === editingWorkgroup._id 
          ? { ...wg, ...editFormData, updatedAt: new Date().toISOString() }
          : wg
      ));
      
      setShowEditModal(false);
      setEditingWorkgroup(null);
      toast.success('Workgroup updated successfully');
      
      if (onEdit) onEdit(editingWorkgroup._id, editFormData);
    } catch (error) {
      console.error('Error updating workgroup:', error);
      toast.error('Failed to update workgroup');
    }
  };

  const handleDelete = async (workgroupId) => {
    const workgroup = workgroups.find(wg => wg._id === workgroupId);
    
    if (workgroup.participantCount > 0) {
      toast.error('Cannot delete workgroup with active participants');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${workgroup.title}"? This action cannot be undone.`)) {
      try {
        // Replace with your actual API call
        await axiosInstance.delete(`/api/fellowship/deleteWorkgroup/${workgroupId}`);
        
        setWorkgroups(prev => prev.filter(wg => wg._id !== workgroupId));
        toast.success('Workgroup deleted successfully');
        
        if (onDelete) onDelete(workgroupId);
      } catch (error) {
        console.error('Error deleting workgroup:', error);
        toast.error('Failed to delete workgroup');
      }
    }
  };

  const toggleWorkgroupStatus = async (workgroupId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      // Replace with your actual API call
      // await axiosInstance.patch(`/api/fellowship/toggleWorkgroupStatus/${workgroupId}`, { isActive: newStatus });
      
      setWorkgroups(prev => prev.map(wg => 
        wg._id === workgroupId 
          ? { ...wg, isActive: newStatus, updatedAt: new Date().toISOString() }
          : wg
      ));
      
      toast.success(`Workgroup ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling workgroup status:', error);
      toast.error('Failed to update workgroup status');
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredWorkgroups = workgroups.filter(workgroup => {
    const matchesSearch = workgroup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workgroup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && workgroup.isActive) ||
                         (statusFilter === 'inactive' && !workgroup.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workgroups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Workgroups</h2>
          <p className="text-gray-600 mt-1">View, edit, and manage all research workgroups</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workgroup
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workgroups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option className='text-black' value="all">All Status</option>
              <option className='text-black' value="active">Active</option>
              <option className='text-black' value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workgroups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkgroups.map((workgroup) => (
          <div key={workgroup._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {workgroup.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Last updated: {formatDate(workgroup.updatedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workgroup.isActive)}`}>
                  {workgroup.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {workgroup.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{workgroup.participantCount} Participants</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>{workgroup.researchPapersCount} Papers</span>
              </div>
            </div>

            {/* Associated Fellowships */}
            {/* <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Associated Fellowships ({workgroup.fellowshipsAssociated.length})
              </h4>
              <div className="space-y-1">
                {workgroup.fellowshipsAssociated.slice(0, 2).map((fellowship, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {fellowship.title} - {fellowship.cycle}
                  </div>
                ))}
                {workgroup.fellowshipsAssociated.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{workgroup.fellowshipsAssociated.length - 2} more fellowships
                  </div>
                )}
              </div>
            </div> */}

            {/* Slack Channel */}
            {workgroup.slackChannelUrl && (
              <div className="mb-4 flex items-center text-sm text-gray-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                <a 
                  href={workgroup.slackChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Slack Channel
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(workgroup)}
                  className="text-black px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => toggleWorkgroupStatus(workgroup._id, workgroup.isActive)}
                  className={`px-3 py-2 rounded-md transition-colors text-sm flex items-center ${
                    workgroup.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {workgroup.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <button
                onClick={() => handleDelete(workgroup._id)}
                className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={workgroup.participantCount > 0 ? 'Cannot delete workgroup with active participants' : 'Delete workgroup'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkgroups.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workgroups found</h3>
          <p className="text-gray-600">No workgroups match your current filters.</p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Workgroup</h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slack Channel URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.slackChannelUrl}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, slackChannelUrl: e.target.value }))}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="https://workspace.slack.com/channels/..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active workgroup
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingWorkgroup(null);
                    }}
                    className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWorkgroups;