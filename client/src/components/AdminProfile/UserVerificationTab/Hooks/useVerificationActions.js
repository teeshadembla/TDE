// components/AdminProfile/Hooks/useVerificationActions.js

import { useState } from 'react';
import axiosInstance from "../../../../config/apiConfig.js"
import { toast } from 'react-toastify';

export const useVerificationActions = (refetchUsers) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Approve user
  const handleApproveUser = async (userId) => {
    try {
      setActionLoading(true);
      
      await axiosInstance.post(`/api/admin/verify-user/${userId}`, {
        sendEmail: true // Automatic email notification
      });

      toast.success('User approved successfully! Notification email sent.');
      
      // Refetch users to update the list
      if (refetchUsers) {
        await refetchUsers();
      }
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error(error.response?.data?.message || 'Failed to approve user');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject user (no email, no reason)
  const handleRejectUser = async (userId) => {
    try {
      setActionLoading(true);
      
      await axiosInstance.post(`/api/admin/reject-user/${userId}`);

      toast.success('User rejected');
      
      // Refetch users to update the list
      if (refetchUsers) {
        await refetchUsers();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error(error.response?.data?.message || 'Failed to reject user');
    } finally {
      setActionLoading(false);
    }
  };

  // View user profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Close profile modal
  const closeProfileModal = () => {
    setSelectedUser(null);
    setShowProfileModal(false);
  };

  // Approve from profile modal
  const handleApproveFromModal = async () => {
    if (selectedUser) {
      await handleApproveUser(selectedUser._id || selectedUser.id);
      closeProfileModal();
    }
  };

  // Reject from profile modal
  const handleRejectFromModal = async () => {
    if (selectedUser) {
      await handleRejectUser(selectedUser._id );
      closeProfileModal();
    }
  };

  return {
    actionLoading,
    selectedUser,
    showProfileModal,
    handleApproveUser,
    handleRejectUser,
    handleViewProfile,
    closeProfileModal,
    handleApproveFromModal,
    handleRejectFromModal
  };
};