// components/AdminProfile/Hooks/useVerificationData.js

import { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/apiConfig';
import { toast } from 'react-toastify';

export const useVerificationData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users based on filters
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        status: filterStatus === 'all' ? undefined : filterStatus,
        sort: sortOrder,
        search: searchQuery || undefined
      };

      const response = await axiosInstance.get('/api/admin/non-verified-Users', { params });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending users (for initial load)
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/pending-users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to load pending users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (filterStatus === 'pending' && !searchQuery) {
      fetchPendingUsers();
    } else {
      fetchUsers();
    }
  }, [filterStatus, sortOrder, searchQuery]);

  // Calculate counts for filter tabs
  const getCounts = () => {
    const all = users.length;
    const pending = users.filter(u => !u.isVerifiedByAdmin && u.status !== 'rejected').length;
    const approved = users.filter(u => u.isVerifiedByAdmin).length;
    const rejected = users.filter(u => u.status === 'rejected').length;

    return { all, pending, approved, rejected };
  };

  // Filter and sort users locally (backup for when API doesn't handle it)
  const getFilteredUsers = () => {
    let filtered = [...users];

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter(u => !u.isVerifiedByAdmin && u.status !== 'rejected');
    } else if (filterStatus === 'approved') {
      filtered = filtered.filter(u => u.isVerifiedByAdmin);
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter(u => u.status === 'rejected');
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(query) || 
        u.email?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (sortOrder === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  };

  return {
    users: getFilteredUsers(),
    loading,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    getCounts,
    refetchUsers: fetchUsers
  };
};