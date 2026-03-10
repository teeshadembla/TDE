import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Save, Upload, ExternalLink, RefreshCw, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/apiConfig.js';

const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  SUBMITTED: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  REVISION_NEEDED: { label: 'Revision Needed', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  APPROVED: { label: 'Approved & Live', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const PORTFOLIO_TYPES = ['project', 'publication', 'talk', 'other'];

const FellowProfileSettings = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingHeadshot, setIsUploadingHeadshot] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', description: '', url: '', type: 'project' });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/fellowProfile/getDraft/${user._id}`);
      setProfile(data.profile || createEmptyProfile());
    } catch (err) {
      // No profile yet — start with empty
      setProfile(createEmptyProfile());
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyProfile = () => ({
    displayName: '',
    headline: '',
    bio: '',
    expertise: [],
    currentRole: { title: '', organization: '' },
    socialLinks: { linkedin: '', twitter: '', github: '', website: '' },
    portfolioItems: [],
    professionalHeadshotUrl: '',
    status: 'DRAFT',
    adminComments: []
  });

  const handleFieldChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !profile.expertise.includes(newExpertise.trim())) {
      setProfile(prev => ({ ...prev, expertise: [...prev.expertise, newExpertise.trim()] }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (index) => {
    setProfile(prev => ({ ...prev, expertise: prev.expertise.filter((_, i) => i !== index) }));
  };

  const addPortfolioItem = () => {
    if (!newPortfolioItem.title.trim()) {
      toast.error('Portfolio item title is required');
      return;
    }
    setProfile(prev => ({ ...prev, portfolioItems: [...prev.portfolioItems, { ...newPortfolioItem }] }));
    setNewPortfolioItem({ title: '', description: '', url: '', type: 'project' });
    setShowPortfolioForm(false);
  };

  const removePortfolioItem = (index) => {
    setProfile(prev => ({ ...prev, portfolioItems: prev.portfolioItems.filter((_, i) => i !== index) }));
  };

  const handleHeadshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setIsUploadingHeadshot(true);
    try {
      // Get presigned URL
      const { data: presignedData } = await axiosInstance.post(`/api/fellowProfile/presigned-url/headshot/${user._id}`, {
        fileType: file.type,
        fileName: file.name
      });

      // Upload directly to S3
      await fetch(presignedData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      // Confirm upload
      const { data: confirmData } = await axiosInstance.put('/api/fellowProfile/headshot/confirmUpload', {
        userId: user._id,
        key: presignedData.key
      });

      setProfile(prev => ({
        ...prev,
        professionalHeadshotUrl: confirmData.url || presignedData.publicUrl,
        professionalHeadshotKey: presignedData.key
      }));
      toast.success('Headshot uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingHeadshot(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post(`/api/fellowProfile/submit/${user._id}`, { ...profile, submitForReview: false });
      toast.success('Draft saved');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (profile.expertise.length < 3) {
      toast.error('Please add at least 3 areas of expertise');
      return;
    }
    if (!profile.bio?.trim() || !profile.headline?.trim() || !profile.displayName?.trim()) {
      toast.error('Please fill in your display name, headline, and bio');
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/api/fellowProfile/submit/${user._id}`, { ...profile, submitForReview: true });
      toast.success('Profile submitted for review!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit for review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
        <RefreshCw size={14} className="animate-spin" /> Loading your public profile...
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[profile?.status] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusConfig.icon;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Public Fellow Profile</h2>
          <p className="mt-1 text-sm text-gray-500">This is what other members and visitors see on the Fellows page</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.color}`}>
          <StatusIcon size={12} /> {statusConfig.label}
        </span>
      </div>

      {/* Admin comments if revision needed */}
      {profile.status === 'REVISION_NEEDED' && profile.adminComments?.length > 0 && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Revision Requested</p>
              {profile.adminComments.slice(-1).map((c, i) => (
                <p key={i} className="mt-1 text-sm text-orange-700">{c.comment}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Headshot */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Professional Headshot</h3>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-100">
              {profile.professionalHeadshotUrl ? (
                <img src={profile.professionalHeadshotUrl} alt="Headshot" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <Upload size={24} />
                </div>
              )}
              {isUploadingHeadshot && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <RefreshCw size={16} className="animate-spin text-gray-600" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Upload a professional headshot</p>
              <p className="text-xs text-gray-500 mb-3">JPG, PNG or WebP — max 5MB. Square photos work best.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingHeadshot}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Upload size={14} /> {profile.professionalHeadshotUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleHeadshotUpload} className="hidden" />
            </div>
          </div>
        </section>

        {/* Identity */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Public Identity</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Display Name <span className="text-red-400">*</span></label>
              <input type="text" value={profile.displayName} onChange={(e) => handleFieldChange('displayName', e.target.value)} maxLength={100} placeholder="e.g. Dr. Jane Smith" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Headline <span className="text-red-400">*</span></label>
              <input type="text" value={profile.headline} onChange={(e) => handleFieldChange('headline', e.target.value)} maxLength={150} placeholder="e.g. AI Researcher | Senior Fellow at XYZ" className={inputClass} />
              <p className="mt-1 text-right text-xs text-gray-400">{profile.headline?.length || 0}/150</p>
            </div>
            <div>
              <label className={labelClass}>Bio <span className="text-red-400">*</span></label>
              <textarea value={profile.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} rows={5} maxLength={3000} placeholder="Write a professional bio for your public profile..." className={inputClass} />
              <p className="mt-1 text-right text-xs text-gray-400">{profile.bio?.length || 0}/3000</p>
            </div>
          </div>
        </section>

        {/* Current Role */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Current Role</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Job Title</label>
              <input type="text" value={profile.currentRole?.title || ''} onChange={(e) => handleNestedChange('currentRole', 'title', e.target.value)} placeholder="Senior Research Lead" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Organization</label>
              <input type="text" value={profile.currentRole?.organization || ''} onChange={(e) => handleNestedChange('currentRole', 'organization', e.target.value)} placeholder="University / Company / NGO" className={inputClass} />
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
            Areas of Expertise <span className="font-normal text-gray-400">(min. 3)</span>
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.expertise.map((item, index) => (
              <span key={index} className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                {item}
                <button type="button" onClick={() => removeExpertise(index)} className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
              placeholder="e.g. Machine Learning, Climate Policy..."
              className={`flex-1 ${inputClass} mt-0`}
            />
            <button type="button" onClick={addExpertise} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Social & Web Links</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {['linkedin', 'twitter', 'github', 'website'].map(platform => (
              <div key={platform}>
                <label className={labelClass}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                <input
                  type="url"
                  value={profile.socialLinks?.[platform] || ''}
                  onChange={(e) => handleNestedChange('socialLinks', platform, e.target.value)}
                  placeholder={platform === 'linkedin' ? 'https://linkedin.com/in/...' : platform === 'twitter' ? 'https://twitter.com/...' : platform === 'github' ? 'https://github.com/...' : 'https://yourwebsite.com'}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Portfolio & Work</h3>
          <div className="space-y-3 mb-4">
            {profile.portfolioItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500 capitalize">{item.type}</span>
                  </div>
                  {item.description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      <ExternalLink size={10} /> {item.url}
                    </a>
                  )}
                </div>
                <button type="button" onClick={() => removePortfolioItem(index)} className="shrink-0 rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {showPortfolioForm ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Title *</label>
                  <input type="text" value={newPortfolioItem.title} onChange={(e) => setNewPortfolioItem(p => ({ ...p, title: e.target.value }))} placeholder="Project / Paper / Talk title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={newPortfolioItem.type} onChange={(e) => setNewPortfolioItem(p => ({ ...p, type: e.target.value }))} className={inputClass}>
                    {PORTFOLIO_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input type="url" value={newPortfolioItem.url} onChange={(e) => setNewPortfolioItem(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={newPortfolioItem.description} onChange={(e) => setNewPortfolioItem(p => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} placeholder="Brief description..." />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={addPortfolioItem} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                  <Plus size={14} /> Add Item
                </button>
                <button type="button" onClick={() => setShowPortfolioForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPortfolioForm(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors w-full justify-center"
            >
              <Plus size={14} /> Add Portfolio Item
            </button>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {profile.status === 'APPROVED'
              ? 'Your profile is live. Updates require re-approval.'
              : 'Save as draft anytime. Submit for review when ready.'
            }
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Save Draft
            </button>
            {profile.status !== 'SUBMITTED' && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={isSaving || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Eye size={14} />}
                {profile.status === 'APPROVED' ? 'Resubmit for Review' : 'Submit for Review'}
              </button>
            )}
            {profile.status === 'SUBMITTED' && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700">
                <Clock size={14} /> Awaiting Review
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FellowProfileSettings;