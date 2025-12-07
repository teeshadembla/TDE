// components/AdminProfile/Utils/verificationConstants.js

import { Shield } from 'lucide-react';

// Add this to your existing tabs array in adminConstants.js
export const verificationTab = {
  id: 'user-verification',
  label: 'User Verification',
  icon: Shield
};

// Verification status options
export const verificationStatuses = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ALL: 'all'
};

// Filter options for the tabs
export const filterTabs = [
  { id: 'all', label: 'All Users', count: 0 },
  { id: 'pending', label: 'Pending', count: 0 },
  { id: 'approved', label: 'Approved', count: 0 },
  { id: 'rejected', label: 'Rejected', count: 0 }
];

// Sort options
export const sortOptions = [
  { value: 'recent', label: 'Recent to Oldest' },
  { value: 'oldest', label: 'Oldest to Newest' }
];

// Status badge colors matching your design system
export const statusColors = {
  pending: {
    bg: '#474646',
    text: '#fff',
    border: '#525252'
  },
  approved: {
    bg: '#062c65',
    text: '#fff',
    border: '#004aad'
  },
  rejected: {
    bg: '#da1e28',
    text: '#fff',
    border: '#da1e28'
  }
};

// Table columns configuration
export const tableColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'signupDate', label: 'Signup Date', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false }
];