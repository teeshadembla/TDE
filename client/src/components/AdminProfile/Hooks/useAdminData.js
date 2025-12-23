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
      const [stats, fellowships, counts, registrations] = await Promise.all([
        fetchAdminStats(),
        fetchPastFellowships(),
        fetchRegistrationCounts(),
        fetchFellowshipRegistrations()
      ]);
      
      setAdminStats(stats);
      setPastFellowships(fellowships);
      setParticipantCount(counts);
      setFellowshipRegistrations(registrations);
    } catch (error) {
      console.error('Error fetching admin data:', error);
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