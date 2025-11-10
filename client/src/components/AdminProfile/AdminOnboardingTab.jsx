import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';
import axiosInstance from '../../config/apiConfig';

// Sub-components

// Status Badge Component
const StatusBadge = ({ status }) => {
  const configs = {
    'PENDING': { bg: 'bg-neutral-800', text: 'text-neutral-400', label: 'Not Started' },
    'IN_PROGRESS': { bg: 'bg-yellow-900/30', text: 'text-yellow-400', label: 'Draft Saved' },
    'SUBMITTED': { bg: 'bg-blue-900/30', text: 'text-blue-400', label: 'Pending Review' },
    'UNDER_REVIEW': { bg: 'bg-purple-900/30', text: 'text-purple-400', label: 'Under Review' },
    'REVISION_NEEDED': { bg: 'bg-orange-900/30', text: 'text-orange-400', label: 'Needs Revision' },
    'APPROVED': { bg: 'bg-green-900/30', text: 'text-green-400', label: 'Approved' }
  };
  
  const config = configs[status] || configs['PENDING'];
  
  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}>
      {config.label}
    </span>
  );
};

// Days Counter Component
const DaysCounter = ({ date, label }) => {
  const daysPassed = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  const isOverdue = daysPassed > 7;
  
  return (
    <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-400' : 'text-neutral-400'}`}>
      <Clock className='w-4 h-4' />
      <span>{daysPassed} days {label}</span>
    </div>
  );
};

// Filter Component
const FilterBar = ({ filters, setFilters, stats }) => {
  return (
    <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6'>
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500' />
            <input
              type='text'
              placeholder='Search by name or email...'
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className='w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className='bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
        >
          <option value='all'>All Statuses ({stats.total})</option>
          <option value='SUBMITTED'>Pending Review ({stats.submitted})</option>
          <option value='REVISION_NEEDED'>Needs Revision ({stats.revision})</option>
          <option value='APPROVED'>Approved ({stats.approved})</option>
        </select>
        
        {/* Cohort Filter */}
        <select
          value={filters.cohort}
          onChange={(e) => setFilters(prev => ({ ...prev, cohort: e.target.value }))}
          className='bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
        >
          <option value='all'>All Cohorts</option>
          <option value='summer'>Summer</option>
          <option value='winter'>Winter</option>
          <option value='spring'>Spring</option>
          <option value='fall'>Fall</option>
        </select>
      </div>
    </div>
  );
};

// Stats Cards
const StatsCards = ({ stats }) => {
  const cards = [
    { label: 'Pending Review', count: stats.submitted, color: 'text-blue-400', icon: Clock },
    { label: 'Not Started', count: stats.notStarted, color: 'text-neutral-400', icon: AlertCircle },
    { label: 'Needs Revision', count: stats.revision, color: 'text-orange-400', icon: MessageSquare },
    { label: 'Approved', count: stats.approved, color: 'text-green-400', icon: CheckCircle }
  ];
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-neutral-400 text-sm mb-1'>{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Profile Preview Modal
const ProfilePreviewModal = ({ profile, onClose, onApprove, onRequestRevision }) => {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleApprove = async () => {
    setLoading(true);
    await onApprove(profile._id);
    setLoading(false);
  };
  
  const handleRevision = async () => {
    if (!comments.trim()) {
      alert('Please provide comments on what needs to be changed');
      return;
    }
    setLoading(true);
    await onRequestRevision(profile._id, comments);
    setLoading(false);
  };
  
  return (
    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto'>
      <div className='bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-neutral-800'>
        {/* Header */}
        <div className='sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex justify-between items-center z-10'>
          <h2 className='text-2xl font-bold text-white'>Profile Review</h2>
          <button onClick={onClose} className='text-neutral-400 hover:text-white'>
            <X className='w-6 h-6' />
          </button>
        </div>
        
        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Applicant Info */}
          <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
            <div className='flex items-center gap-4 mb-4'>
              <img 
                src={profile.professionalHeadshot} 
                alt={profile.displayName}
                className='w-20 h-20 rounded-lg object-cover border-2 border-neutral-700'
              />
              <div>
                <h3 className='text-xl font-semibold text-white'>{profile.displayName}</h3>
                <p className='text-neutral-400'>{profile.userId?.email}</p>
                <StatusBadge status={profile.status} />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-neutral-500'>Submitted:</span>
                <span className='text-white ml-2'>
                  {new Date(profile.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className='text-neutral-500'>Cohort:</span>
                <span className='text-white ml-2'>
                  {profile.fellowshipRegistrationId?.fellowship?.cycle || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Profile Data Preview */}
          <div className='space-y-4'>
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <h4 className='text-sm font-medium text-neutral-400 mb-2'>Professional Headline</h4>
              <p className='text-white'>{profile.headline}</p>
            </div>
            
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <h4 className='text-sm font-medium text-neutral-400 mb-2'>Bio</h4>
              <p className='text-white'>{profile.bio}</p>
            </div>
            
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <h4 className='text-sm font-medium text-neutral-400 mb-2'>Current Role</h4>
              <p className='text-white'>
                {profile.currentRole.title} at {profile.currentRole.organization}
              </p>
            </div>
            
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <h4 className='text-sm font-medium text-neutral-400 mb-2'>Areas of Expertise</h4>
              <div className='flex flex-wrap gap-2 mt-2'>
                {profile.expertise.map((skill, index) => (
                  <span key={index} className='bg-neutral-700 text-white px-3 py-1 rounded-full text-sm'>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
              <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
                <h4 className='text-sm font-medium text-neutral-400 mb-2'>Social Links</h4>
                <div className='space-y-2'>
                  {Object.entries(profile.socialLinks).map(([platform, url]) => 
                    url && (
                      <div key={platform}>
                        <span className='text-neutral-500 capitalize'>{platform}:</span>
                        <a href={url} target='_blank' rel='noopener noreferrer' 
                           className='text-blue-400 hover:text-blue-300 ml-2 break-all'>
                          {url}
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            
            {profile.portfolioItems && profile.portfolioItems.length > 0 && (
              <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
                <h4 className='text-sm font-medium text-neutral-400 mb-2'>Portfolio</h4>
                <div className='space-y-3'>
                  {profile.portfolioItems.map((item, index) => (
                    <div key={index} className='border-l-2 border-blue-500 pl-3'>
                      <p className='text-white font-medium'>{item.title}</p>
                      <p className='text-neutral-400 text-sm'>{item.description}</p>
                      {item.url && (
                        <a href={item.url} target='_blank' rel='noopener noreferrer'
                           className='text-blue-400 hover:text-blue-300 text-sm'>
                          View →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Admin Comments Section */}
          {profile.status === 'SUBMITTED' && (
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <label className='block text-sm font-medium text-neutral-400 mb-2'>
                Comments / Revision Requests
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder='Provide specific feedback on what needs to be changed...'
                rows={4}
                className='w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none'
              />
            </div>
          )}
          
          {/* Previous Comments */}
          {profile.adminComments && profile.adminComments.length > 0 && (
            <div className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'>
              <h4 className='text-sm font-medium text-neutral-400 mb-3'>Previous Feedback</h4>
              <div className='space-y-3'>
                {profile.adminComments.map((comment, index) => (
                  <div key={index} className='bg-neutral-900 rounded p-3'>
                    <p className='text-white text-sm'>{comment.comment}</p>
                    <p className='text-neutral-500 text-xs mt-2'>
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {profile.status === 'SUBMITTED' && (
          <div className='sticky bottom-0 bg-neutral-900 border-t border-neutral-800 p-6 flex gap-4'>
            <button
              onClick={handleRevision}
              disabled={loading}
              className='flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <MessageSquare className='w-5 h-5' />
              Request Revision
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <CheckCircle className='w-5 h-5' />
              Approve Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
      const response = await axiosInstance.get('/api/admin/onboarding-profiles', { params });
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
      await axiosInstance.post(`/api/admin/onboarding-profiles/${profileId}/approve`);
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
      await axiosInstance.post(`/api/admin/onboarding-profiles/${profileId}/request-revision`, {
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
      await axiosInstance.post(`/api/admin/send-onboarding-reminder/${registrationId}`);
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
            Pending Review ({stats.submitted})
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
                    {profile.professionalHeadshot ? (
                      <img 
                        src={profile.professionalHeadshot}
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