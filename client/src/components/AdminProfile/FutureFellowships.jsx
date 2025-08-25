import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import axiosInstance from '../../config/apiConfig';
import { toast } from 'react-toastify';

const FutureFellowships = ({ onEdit, onDelete, onViewDetails, setActiveTab }) => {
  const [fellowships, setFellowships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFellowship, setEditingFellowship] = useState(null);
  const [editFormData, setEditFormData] = useState({
    startDate: '',
    applicationDeadline: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFutureFellowships();
  }, []);

  const fetchFutureFellowships = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/fellowship/getFutureFellowships");
      console.log("These are future fellowships-->", response?.data?.fellowships);
      setFellowships(response?.data?.fellowships || []);
    } catch (error) {
      console.error('Error fetching future fellowships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (fellowship) => {
    setEditingFellowship(fellowship);
    setEditFormData({
      startDate: fellowship.startDate ? new Date(fellowship.startDate).toISOString().split('T')[0] : '',
      applicationDeadline: fellowship.applicationDeadline ? new Date(fellowship.applicationDeadline).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingFellowship) return;

    try {
      setSaving(true);
      
      const updateData = {
        startDate: editFormData.startDate ? new Date(editFormData.startDate).toISOString() : null,
        applicationDeadline: editFormData.applicationDeadline ? new Date(editFormData.applicationDeadline).toISOString() : null
      };

      // Replace with your actual API endpoint
      const response = await axiosInstance.patch(`/api/fellowship/update/${editingFellowship._id}`, updateData);
      
      // Update the local state
      setFellowships(prev => prev.map(fellowship => 
        fellowship._id === editingFellowship._id 
          ? { ...fellowship, ...updateData }
          : fellowship
      ));

      setShowEditModal(false);
      setEditingFellowship(null);
      toast.success('Fellowship updated successfully!');
      
      if (onEdit) onEdit(editingFellowship);
    } catch (error) {
      console.error('Error updating fellowship:', error);
      toast.error('Error updating fellowship');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingFellowship(null);
    setEditFormData({
      startDate: '',
      applicationDeadline: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'PLANNING': return 'bg-purple-100 text-purple-800';
      case 'OPEN_FOR_APPLICATIONS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `$${(amount / 100).toLocaleString()}`;
  };

  const filteredFellowships = fellowships.filter(fellowship => {
    const matchesSearch = fellowship?.cycle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fellowship?.workGroupId?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fellowship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (fellowshipId) => {
    if (window.confirm('Are you sure you want to delete this fellowship? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/api/fellowship/delete/${fellowshipId}`);
        setFellowships(prev => prev.filter(f => f._id !== fellowshipId));
        if (onDelete) onDelete(fellowshipId);
      } catch (error) {
        console.error('Error deleting fellowship:', error);
        alert('Error deleting fellowship');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading future fellowships...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Future Fellowships</h2>
            <p className="text-gray-600 mt-1">Manage upcoming and planned fellowship programs</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Fellowship
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fellowships..."
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
                <option className='text-black' value="UPCOMING">Upcoming</option>
                <option className='text-black' value="DRAFT">Draft</option>
                <option className='text-black' value="PLANNING">Planning</option>
                <option className='text-black' value="OPEN_FOR_APPLICATIONS">Open for Applications</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fellowships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFellowships.map((fellowship) => (
            <div key={fellowship._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {fellowship?.workGroupId?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {fellowship.cycle}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fellowship.status)}`}>
                  {fellowship?.status?.replace('_', ' ')}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {fellowship?.workGroupId?.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Date
                  </div>
                  <span className="text-black font-medium">{formatDate(fellowship.startDate)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Application Deadline
                  </div>
                  <span className="text-black font-medium">{formatDate(fellowship.applicationDeadline)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Capacity
                  </div>
                  <span className="text-black font-medium">{fellowship?.workGroupId?.maxMembers} participants</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Fee
                  </div>
                  <span className="text-black font-medium">Starts at 4000$</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onViewDetails) onViewDetails(fellowship);
                  }}
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                >
                  <Eye className="text-black w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(fellowship);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(fellowship._id);
                  }}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFellowships.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fellowships found</h3>
            <p className="text-gray-600">No future fellowships match your current filters.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Fellowship</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Fellowship Title (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fellowship Title
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 text-sm">
                  {editingFellowship?.workGroupId?.title}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) => handleEditFormChange('startDate', e.target.value)}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editFormData.applicationDeadline}
                  onChange={(e) => handleEditFormChange('applicationDeadline', e.target.value)}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              {/* Validation Message */}
              {editFormData.applicationDeadline && editFormData.startDate && 
               new Date(editFormData.applicationDeadline) >= new Date(editFormData.startDate) && (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Application deadline should be before the start date
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving || !editFormData.startDate || !editFormData.applicationDeadline || 
                         new Date(editFormData.applicationDeadline) >= new Date(editFormData.startDate)}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FutureFellowships;