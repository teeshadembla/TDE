import { useState, useEffect } from 'react';
import { fetchAdminStats, fetchPastFellowships, fetchRegistrationCounts, fetchFellowshipRegistrations } from '../Services/AdminServices.js';

// Consolidate all data fetching logic
export const useAdminData = () => {
  const [adminStats, setAdminStats] = useState({});
  const [pastFellowships, setPastFellowships] = useState([]);
  const [participantCount, setParticipantCount] = useState({});
  const [fellowshipRegistrations, setFellowshipRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAllData();
  }, []);

  return {
    adminStats,
    pastFellowships,
    participantCount,
    fellowshipRegistrations,
    setFellowshipRegistrations,
    loading,
    setLoading
  };
};