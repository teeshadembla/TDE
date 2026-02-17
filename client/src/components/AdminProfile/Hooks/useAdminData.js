import { useState, useEffect } from 'react';
import { fetchAdminStats, fetchPastFellowships, fetchRegistrationCounts, fetchFellowshipRegistrations } from '../Services/AdminServices.js';

// Consolidate all data fetching logic
export const useAdminData = () => {
  const [adminStats, setAdminStats] = useState({});
  const [pastFellowships, setPastFellowships] = useState([]);
  const [participantCount, setParticipantCount] = useState({});
  const [fellowshipRegistrations, setFellowshipRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  // NEW: Function to fetch all data (extracted for reusability)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch admin data...');
      
      const results = await Promise.allSettled([
        fetchAdminStats(),
        fetchPastFellowships(),
        fetchRegistrationCounts(),
        fetchFellowshipRegistrations()
      ]);

      // Handle results with better error reporting
      const [statsResult, fellowshipsResult, countsResult, registrationsResult] = results;
      
      if (statsResult.status === 'fulfilled') {
        setAdminStats(statsResult.value);
        console.log('Admin stats fetched successfully');
      } else {
        console.error('Failed to fetch admin stats:', statsResult.reason);
      }

      if (fellowshipsResult.status === 'fulfilled') {
        setPastFellowships(fellowshipsResult.value);
        console.log('Past fellowships fetched successfully');
      } else {
        console.error('Failed to fetch past fellowships:', fellowshipsResult.reason);
      }

      if (countsResult.status === 'fulfilled') {
        setParticipantCount(countsResult.value);
        console.log('Registration counts fetched successfully');
      } else {
        console.error('Failed to fetch registration counts:', countsResult.reason);
      }

      if (registrationsResult.status === 'fulfilled') {
        setFellowshipRegistrations(registrationsResult.value);
        console.log('Fellowship registrations fetched successfully');
      } else {
        console.error('Failed to fetch fellowship registrations:', registrationsResult.reason);
      }
    } catch (error) {
      console.error('Unexpected error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to refresh only applications (faster than full refresh)
  const refreshApplications = async () => {
    try {
      const [stats, registrations] = await Promise.all([
        fetchAdminStats(),
        fetchFellowshipRegistrations()
      ]);
      
      setAdminStats(stats);
      setFellowshipRegistrations(registrations);
    } catch (error) {
      console.error('Error refreshing applications:', error);
    }
  };

  // NEW: Function to do a complete refresh of all data
  const refreshAllData = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    adminStats,
    pastFellowships,
    participantCount,
    fellowshipRegistrations,
    setFellowshipRegistrations,
    loading,
    setLoading,
    refreshApplications,      // NEW: Export this
    refreshAllData           // NEW: Export this (optional, for full refresh)
  };
};