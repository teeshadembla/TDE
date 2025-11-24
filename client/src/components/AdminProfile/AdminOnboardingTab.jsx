import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';
import axiosInstance from '../../config/apiConfig';
import StatusBadge from './AdminOnboardingTab/UiComponents/StatusBadge.jsx';



import DaysCounter from './AdminOnboardingTab/UiComponents/DaysCounter.jsx';
import FilterBar from './AdminOnboardingTab/UiComponents/FilterBar.jsx';
import StatsCards from './AdminOnboardingTab/UiComponents/StatsCard.jsx';
import ProfilePreviewModal from './AdminOnboardingTab/UiComponents/ProfilePreviewModal.jsx';

// Main Component
const AdminOnboardingTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('pending-review');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    cohort: 'all'
  });
  
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    notStarted: 0,
    revision: 0,
    approved: 0
  });
  
  useEffect(() => {
    fetchProfiles();
  }, [activeSubTab, filters]);
  
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = {
        tab: activeSubTab,
        ...filters
      };

      console.log("THESE ARE PARAMS---->", params);
      const response = await axiosInstance.get('/api/fellow-profile/onboarding-profiles', { params });
      setProfiles(response.data.profiles);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (profileId) => {
    try {
      await axiosInstance.post(`/api/fellow-profile/onboarding-profiles/${profileId}/approve`);
      alert('Profile approved successfully!');
      setSelectedProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error('Error approving profile:', error);
      alert('Failed to approve profile');
    }
  };
  
  const handleRequestRevision = async (profileId, comments) => {
    try {
      await axiosInstance.post(`/api/fellow-profile/onboarding-profiles/${profileId}/request-revision`, {
        comments
      });
      alert('Revision request sent successfully!');
      setSelectedProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error('Error requesting revision:', error);
      alert('Failed to send revision request');
    }
  };
  
  const sendReminder = async (registrationId) => {
    try {
      await axiosInstance.post(`/api/fellow-profile/send-onboarding-reminder/${registrationId}`);
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder');
    }
  };
  
  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Fellow Onboarding</h1>
          <p className='text-neutral-400 text-lg'>
            Review and approve fellow profiles before they go public
          </p>
        </div>
        
        {/* Stats */}
        <StatsCards stats={stats} />
        
        {/* Sub-tabs */}
        <div className='flex gap-2 mb-6 border-b border-neutral-800'>
          <button
            onClick={() => setActiveSubTab('pending-review')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSubTab === 'pending-review'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pending Review ({stats.total})
          </button>
          <button
            onClick={() => setActiveSubTab('not-started')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSubTab === 'not-started'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Not Started ({stats.notStarted})
          </button>
        </div>
        
        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} stats={stats} />
        
        {/* Content */}
        {loading ? (
          <div className='text-center py-16'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
            <p className='text-neutral-400 mt-4'>Loading profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className='text-center py-16 bg-neutral-900 rounded-lg border border-neutral-800'>
            <AlertCircle className='w-16 h-16 text-neutral-600 mx-auto mb-4' />
            <p className='text-neutral-400 text-lg'>No profiles found</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {profiles.map((profile) => (
              <div 
                key={profile._id}
                className='bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-start gap-4 flex-1'>
                    {profile.professionalHeadshotUrl ? (
                      <img 
                        src={profile.professionalHeadshotUrl}
                        alt={profile.displayName}
                        className='w-16 h-16 rounded-lg object-cover border-2 border-neutral-700'
                      />
                    ) : (
                      <div className='w-16 h-16 rounded-lg bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center'>
                        <Users className='w-8 h-8 text-neutral-600' />
                      </div>
                    )}
                    
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-semibold text-white'>
                          {profile.displayName || profile.userId?.FullName || 'No Name'}
                        </h3>
                        <StatusBadge status={profile.onboardingStatus || profile.status} />
                      </div>
                      
                      <p className='text-neutral-400 text-sm mb-2'>
                        {profile.userId?.email}
                      </p>
                      
                      {profile.headline && (
                        <p className='text-neutral-300 text-sm mb-2'>{profile.headline}</p>
                      )}
                      
                      <div className='flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-2 text-neutral-500'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {profile.fellowshipRegistrationId?.fellowship?.cycle || 'N/A'} Cohort
                          </span>
                        </div>
                        
                        {profile.submittedAt ? (
                          <DaysCounter date={profile.submittedAt} label='since submission' />
                        ) : profile.fellowshipRegistrationId?.paymentCompletedAt ? (
                          <DaysCounter date={profile.fellowshipRegistrationId.paymentCompletedAt} label='since payment' />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex gap-2'>
                    {activeSubTab === 'pending-review' && profile.status === 'SUBMITTED' && (
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'
                      >
                        <Eye className='w-4 h-4' />
                        Review
                      </button>
                    )}
                    
                    {activeSubTab === 'not-started' && (
                      <button
                        onClick={() => sendReminder(profile.fellowshipRegistrationId?._id)}
                        className='bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-neutral-700'
                      >
                        <Mail className='w-4 h-4' />
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Profile Preview Modal */}
      {selectedProfile && (
        <ProfilePreviewModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onApprove={handleApprove}
          onRequestRevision={handleRequestRevision}
        />
      )}
    </div>
  );
};

export default AdminOnboardingTab;