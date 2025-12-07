// components/AdminProfile/UserVerificationTab.jsx

import React from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Mail,
  Linkedin,
  User,
  X,
  Shield,
  Clock,
  Filter
} from 'lucide-react';
import { useVerificationData } from './Hooks/useVerificationData.js';
import { useVerificationActions } from './Hooks/useVerificationActions.js';
import { filterTabs, sortOptions, statusColors } from "./Utils/verificationContants.js"

const UserVerificationTab = () => {
  const {
    users,
    loading,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    getCounts,
    refetchUsers
  } = useVerificationData();

  const {
    actionLoading,
    selectedUser,
    showProfileModal,
    handleApproveUser,
    handleRejectUser,
    handleViewProfile,
    closeProfileModal,
    handleApproveFromModal,
    handleRejectFromModal
  } = useVerificationActions(refetchUsers);

  const counts = getCounts();

  // Get user status
  const getUserStatus = (user) => {
    if (user.isVerifiedbyAdmin) return 'approved';
    return 'pending';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate waiting time
  const getWaitingTime = (signupDate) => {
    if (!signupDate) return 'N/A';
    const days = Math.floor((new Date() - new Date(signupDate)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>User Verification</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4a4a' }}>
            Manage user account approvals and access control
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#062c65' }}>
          <Shield className="w-5 h-5" style={{ color: '#fff' }} />
          <span className="font-semibold" style={{ color: '#fff' }}>
            {counts.pending} Pending
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#525252' }}>
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b pb-4" style={{ borderColor: '#d9d9d9' }}>
          {filterTabs.map((tab) => {
            const count = counts[tab.id];
            const isActive = filterStatus === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  background: isActive ? '#062c65' : 'transparent',
                  color: isActive ? '#fff' : '#4a4a4a',
                  border: isActive ? 'none' : '1px solid transparent'
                }}
              >
                {tab.label}
                <span 
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: isActive ? '#004aad' : '#d9d9d9',
                    color: isActive ? '#fff' : '#1a1a1a'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#4a4a4a' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                background: '#393939',
                borderColor: '#525252',
                color: '#fff'
              }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: '#4a4a4a' }} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                background: '#393939',
                borderColor: '#525252',
                color: '#fff'
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#525252' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: '#d9d9d9', borderTopColor: '#062c65' }}
              ></div>
              <p style={{ color: '#4a4a4a' }}>Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Shield className="w-16 h-16 mb-4" style={{ color: '#4a4a4a', opacity: 0.3 }} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>No users found</p>
            <p style={{ color: '#4a4a4a' }}>
              {searchQuery ? 'Try adjusting your search' : 'No users match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#474646' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#fff' }}>User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#fff' }}>Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#fff' }}>Signup Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#fff' }}>Waiting</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#fff' }}>Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: '#fff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const status = getUserStatus(user);
                  const statusColor = statusColors[status];
                  
                  return (
                    <tr 
                      key={user._id || user.id || index}
                      className="border-b hover:bg-opacity-50 transition-colors"
                      style={{ borderColor: '#d9d9d9', background: index % 2 === 0 ? '#fff' : '#f9f9f9' }}
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt={user.FullName}
                              className="w-10 h-10 rounded-full object-cover"
                              style={{ border: '2px solid #d9d9d9' }}
                            />
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: '#062c65' }}
                            >
                              <User className="w-5 h-5" style={{ color: '#fff' }} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold" style={{ color: '#1a1a1a' }}>
                              {user.FullName || 'No Name'}
                            </p>
                            {user.socialLinks.LinkedIn && (
                              <a 
                                href={user.socialLinks.LinkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 hover:underline"
                                style={{ color: '#004aad' }}
                              >
                                <Linkedin className="w-3 h-3" />
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                          <span style={{ color: '#1a1a1a' }}>{user.email}</span>
                        </div>
                      </td>

                      {/* Signup Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                          <span style={{ color: '#1a1a1a' }}>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Waiting Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                          <span style={{ color: '#1a1a1a' }}>{getWaitingTime(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
                            style={{ background: '#393939' }}
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" style={{ color: '#fff' }} />
                          </button>
                          
                          {status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveUser(user?._id )}
                                disabled={actionLoading}
                                className="p-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                                style={{ background: '#062c65' }}
                                title="Approve User"
                              >
                                <CheckCircle className="w-4 h-4" style={{ color: '#fff' }} />
                              </button>
                              
                              <button
                                onClick={() => handleRejectUser(user?._id )}
                                disabled={actionLoading}
                                className="p-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                                style={{ background: '#da1e28' }}
                                title="Reject User"
                              >
                                <XCircle className="w-4 h-4" style={{ color: '#fff' }} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={closeProfileModal}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 border-b flex items-center justify-between" style={{ background: '#062c65', borderColor: '#004aad' }}>
              <h2 className="text-xl font-bold" style={{ color: '#fff' }}>User Profile</h2>
              <button
                onClick={closeProfileModal}
                className="p-2 rounded-lg hover:bg-opacity-20 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: '#fff' }} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Image & Name */}
              <div className="flex items-center gap-4">
                {selectedUser.profilePicture ? (
                  <img 
                    src={selectedUser.profilePicture} 
                    alt={selectedUser.FullName}
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ border: '3px solid #062c65' }}
                  />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: '#062c65' }}
                  >
                    <User className="w-12 h-12" style={{ color: '#fff' }} />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    {selectedUser.FullName || 'No Name'}
                  </h3>
                  <p style={{ color: '#4a4a4a' }}>{selectedUser.email}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 gap-4">
                {/* Email */}
                <div className="p-4 rounded-lg" style={{ background: '#f9f9f9', border: '1px solid #d9d9d9' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#4a4a4a' }}>Email</span>
                  </div>
                  <p style={{ color: '#1a1a1a' }}>{selectedUser.email}</p>
                </div>

                {/* LinkedIn */}
                {selectedUser.socialLinks.LinkedIn && (
                  <div className="p-4 rounded-lg" style={{ background: '#f9f9f9', border: '1px solid #d9d9d9' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Linkedin className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                      <span className="text-sm font-semibold" style={{ color: '#4a4a4a' }}>LinkedIn</span>
                    </div>
                    <a 
                      href={selectedUser.socialLinks.LinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: '#004aad' }}
                    >
                      {selectedUser.socialLinks.LinkedIn}
                    </a>
                  </div>
                )}

                {/* Signup Date */}
                <div className="p-4 rounded-lg" style={{ background: '#f9f9f9', border: '1px solid #d9d9d9' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#4a4a4a' }}>Signup Date</span>
                  </div>
                  <p style={{ color: '#1a1a1a' }}>{formatDate(selectedUser.createdAt)}</p>
                </div>


                {/* Status */}
                <div className="p-4 rounded-lg" style={{ background: '#f9f9f9', border: '1px solid #d9d9d9' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" style={{ color: '#4a4a4a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#4a4a4a' }}>Current Status</span>
                  </div>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: statusColors[getUserStatus(selectedUser)].bg,
                      color: statusColors[getUserStatus(selectedUser)].text,
                      border: `1px solid ${statusColors[getUserStatus(selectedUser)].border}`
                    }}
                  >
                    {getUserStatus(selectedUser).charAt(0).toUpperCase() + getUserStatus(selectedUser).slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            {getUserStatus(selectedUser) === 'pending' && (
              <div className="sticky bottom-0 px-6 py-4 border-t flex items-center justify-end gap-3" style={{ background: '#fff', borderColor: '#d9d9d9' }}>
                <button
                  onClick={closeProfileModal}
                  className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:bg-opacity-80"
                  style={{ background: '#393939', color: '#fff' }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleRejectFromModal}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:bg-opacity-90 disabled:opacity-50"
                  style={{ background: '#da1e28', color: '#fff' }}
                >
                  Reject
                </button>
                
                <button
                  onClick={handleApproveFromModal}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:bg-opacity-90 disabled:opacity-50"
                  style={{ background: '#062c65', color: '#fff' }}
                >
                  Approve & Notify
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationTab;