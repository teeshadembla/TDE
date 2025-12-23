import { useState } from 'react';
import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';
import StatusBadge from './StatusBadge';

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
                src={profile.professionalHeadshotUrl} 
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
                  {new Date(profile.updatedAt).toLocaleDateString()}
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

export default ProfilePreviewModal;