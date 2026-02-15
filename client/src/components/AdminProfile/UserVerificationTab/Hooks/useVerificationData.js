// components/AdminProfile/Hooks/useVerificationData.js

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../config/apiConfig';
import { toast } from 'react-toastify';

export const useVerificationData = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users to get accurate counts
  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/admin/non-verified-Users', { 
        params: { status: 'all' } 
      });
      setAllUsers(response.data?.users || response.data || []);
    } catch (error) {
      console.error('Error fetching all users for counts:', error);
    }
  }, []);

  // Fetch users based on filters
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        status: filterStatus === 'all' ? 'all' : filterStatus,
        sort: sortOrder,
        search: searchQuery || undefined
      };

      const response = await axiosInstance.get('/api/admin/non-verified-Users', { params });
      
      // Extract users from response - handle different response formats
      let fetchedUsers = response.data?.users || response.data || [];
      
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, sortOrder, searchQuery]);

  // Initial fetch and refetch on filter/search change
  useEffect(() => {
    fetchAllUsers();
    fetchUsers();
  }, [fetchAllUsers, fetchUsers]);

  // Calculate counts for filter tabs based on ALL users
  const getCounts = useCallback(() => {
    const all = allUsers.length;
    const pending = allUsers.filter(u => !u.isVerifiedbyAdmin && !u.isRejectedByAdmin).length;
    const approved = allUsers.filter(u => (u.isVerifiedbyAdmin === true && u.isRejectedByAdmin===false)).length;
    const rejected = allUsers.filter(u => (u.isRejectedByAdmin === true && u.isVerifiedbyAdmin===false)).length;

    return { all, pending, approved, rejected };
  }, [allUsers]);

  // Filter and sort users locally
  const getFilteredUsers = useCallback(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.FullName?.toLowerCase().includes(query) || 
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (sortOrder === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [users, searchQuery, sortOrder]);

  const refetchUsers = useCallback(async () => {
    await fetchAllUsers();
    await fetchUsers();
  }, [fetchAllUsers, fetchUsers]);

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
    refetchUsers
  };
};