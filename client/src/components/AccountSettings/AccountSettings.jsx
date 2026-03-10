import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Save, Plus, X, Trash, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';

const c = {
  bg:              '#000000',
  bgInverse:       '#ffffff',
  bgSecondary:     '#474646',
  field:           '#393939',
  fieldHover:      '#474747',
  border:          '#525252',
  brand950grey:    '#262626',
  brand800grey:    '#474646',
  brand600grey:    '#888888',
  brand400grey:    '#adadad',
  brand200grey:    '#d9d9d9',
  brand50grey:     '#f6f5f5',
  textPrimary:     '#ffffff',
  textSecondary:   '#9f9f9f',
  textInverse:     '#161616',
  textPlaceholder: '#cccbcb',
  textDisabled:    '#aaa7a7',
  textError:       '#ff8389',
  textOnColor:     '#ffffff',
  btnPrimary:      '#105abd',
  btnPrimaryHover: '#062c65',
  btnSecondary:    '#6f6f6f',
  btnSecHover:     '#606060',
  btnDanger:       '#da1e28',
  btnDisabled:     '#525252',
  brandBlue:       '#004aad',
  brandBlue2:      '#062c65',
  brandBlue600:    '#0079ff',
};

/* ─── Reusable input style ────────────────────────────────────────── */
const baseInput = {
  display: 'block',
  width: '100%',
  background: c.field,
  border: `1px solid ${c.border}`,
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '14px',
  color: c.textPrimary,
  outline: 'none',
  transition: 'border-color 0.15s, background 0.15s',
  marginTop: '6px',
  boxSizing: 'border-box',
};

const labelSt = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: c.textSecondary,
};

const sectionHead = {
  fontSize: '13px',
  fontWeight: '600',
  color: c.brand400grey,
  borderBottom: `1px solid ${c.border}`,
  paddingBottom: '8px',
  marginBottom: '16px',
  marginTop: 0,
};

const focusHandlers = {
  onFocus: e => { e.target.style.borderColor = c.brandBlue600; e.target.style.background = c.fieldHover; },
  onBlur:  e => { e.target.style.borderColor = c.border;       e.target.style.background = c.field; },
};

/* ─── Password section (Clerk) ────────────────────────────────────── */
const PasswordSection = () => {
  const { user } = useUser();
  const [fields, setFields] = useState({ current: '', next: '', confirm: '' });
  const [show,   setShow]   = useState({ current: false, next: false, confirm: false });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const toggle = key => setShow(p => ({ ...p, [key]: !p[key] }));

  const handleSubmit = async () => {
    if (!fields.current || !fields.next || !fields.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (fields.next !== fields.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (fields.next.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setStatus('loading');
    try {
      await user.updatePassword({ currentPassword: fields.current, newPassword: fields.next });
      toast.success('Password updated successfully');
      setStatus('success');
      setFields({ current: '', next: '', confirm: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      toast.error(err.errors?.[0]?.message || 'Failed to update password');
      setStatus('idle');
    }
  };

  const inputFields = [
    { key: 'current', label: 'Current Password' },
    { key: 'next',    label: 'New Password' },
    { key: 'confirm', label: 'Confirm New Password' },
  ];

  return (
    <section>
      <p style={sectionHead}>Change Password</p>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {inputFields.map(({ key, label }) => (
          <div key={key}>
            <label style={labelSt}>{label}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show[key] ? 'text' : 'password'}
                value={fields[key]}
                onChange={e => setFields(p => ({ ...p, [key]: e.target.value }))}
                placeholder="••••••••"
                style={{ ...baseInput, paddingRight: '40px' }}
                {...focusHandlers}
              />
              <button
                type="button"
                onClick={() => toggle(key)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.textSecondary, padding: 0, display: 'flex' }}
              >
                {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'loading'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: status === 'success' ? '#1a5c2a' : c.btnPrimary,
            color: c.textOnColor, border: 'none', borderRadius: '8px',
            padding: '10px 20px', fontSize: '13px', fontWeight: '600',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => status === 'idle' && (e.currentTarget.style.background = c.btnPrimaryHover)}
          onMouseLeave={e => status === 'idle' && (e.currentTarget.style.background = c.btnPrimary)}
        >
          {status === 'loading' && <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />}
          {status === 'success' && <CheckCircle size={14} />}
          {status === 'loading' ? 'Updating...' : status === 'success' ? 'Password Updated' : 'Update Password'}
        </button>
      </div>
    </section>
  );
};

/* ─── Main component ──────────────────────────────────────────────── */
const AccountSettings = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    FullName: '', email: '', location: '', title: '', department: '', company: '',
    socialLinks: { twitter: '', linkedin: '', instagram: '' },
    introduction: '', expertise: [], followedTopics: [],
  });
  const [newExpertise, setNewExpertise]         = useState('');
  const [newTopic, setNewTopic]                 = useState('');
  const [isSaving, setIsSaving]                 = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    axiosInstance.get(`/api/user/${user._id}`)
      .then(({ data }) => {
        const u = data.user;
        setFormData({
          FullName:    u.FullName     || '',
          email:       u.email        || '',
          location:    u.location     || '',
          title:       u.title        || '',
          department:  u.department   || '',
          company:     u.company      || '',
          socialLinks: {
            twitter:   u.socialLinks?.twitter   || '',
            linkedin:  u.socialLinks?.linkedin  || '',
            instagram: u.socialLinks?.instagram || '',
          },
          introduction:  u.introduction   || '',
          expertise:     u.expertise      || [],
          followedTopics:u.followedTopics || [],
        });
      })
      .catch(err => console.error('Error fetching user:', err));
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('social-')) {
      const platform = name.split('-')[1];
      setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: value } }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const addTag = (field, value, clear) => {
    if (!value.trim()) return;
    setFormData(p => ({ ...p, [field]: [...p[field], value.trim()] }));
    clear('');
  };
  const removeTag = (field, i) => setFormData(p => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.patch(`/api/user/update/${user._id}`, formData);
      toast.success('Profile updated successfully');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/api/user/logout');
      await axiosInstance.delete(`/api/user/delete/${user._id}`);
      toast.success('Account deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error deleting account');
    }
  };

  /* ── Sub-components ── */
  const Field = ({ label, name, type = 'text', placeholder = '' }) => {
    const value = name.startsWith('social-')
      ? formData.socialLinks[name.split('-')[1]]
      : formData[name];
    return (
      <div>
        <label style={labelSt}>{label}</label>
        <input type={type} name={name} value={value} onChange={handleChange} placeholder={placeholder} style={baseInput} {...focusHandlers} />
      </div>
    );
  };

  const TagPill = ({ label, onRemove, accent }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '500',
      background: accent ? c.brandBlue : 'transparent',
      border: `1px solid ${accent ? c.brandBlue : c.border}`,
      color: accent ? c.textOnColor : c.brand400grey,
    }}>
      {label}
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', alignItems: 'center' }}>
        <X size={11} />
      </button>
    </span>
  );

  const AddRow = ({ value, onChange, onAdd, onKeyDown, placeholder }) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ ...baseInput, flex: 1, marginTop: 0 }}
        {...focusHandlers}
      />
      <button
        type="button"
        onClick={onAdd}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: c.bgSecondary, color: c.textPrimary, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}
        onMouseEnter={e => e.currentTarget.style.background = c.brand950grey}
        onMouseLeave={e => e.currentTarget.style.background = c.bgSecondary}
      >
        <Plus size={14} /> Add
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: c.textPrimary, margin: 0 }}>Account Details</h2>
        <p style={{ fontSize: '13px', color: c.textSecondary, marginTop: '4px', marginBottom: 0 }}>Manage your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

        {/* Basic Info */}
        <section>
          <p style={sectionHead}>Basic Information</p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            <Field label="Full Name" name="FullName" />
            <Field label="Email"     name="email"    type="email" />
          </div>
        </section>

        {/* Password */}
        <PasswordSection />

        {/* Professional */}
        <section>
          <p style={sectionHead}>Professional Information</p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            <Field label="Title"      name="title" />
            <Field label="Department" name="department" />
            <Field label="Company"    name="company" />
            <Field label="Location"   name="location" />
          </div>
        </section>

        {/* Social Links */}
        <section>
          <p style={sectionHead}>Social Links</p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            <Field label="Twitter"   name="social-twitter"   type="url" placeholder="https://twitter.com/username" />
            <Field label="LinkedIn"  name="social-linkedin"  type="url" placeholder="https://linkedin.com/in/username" />
            <Field label="Instagram" name="social-instagram" type="url" placeholder="https://instagram.com/username" />
          </div>
        </section>

        {/* Introduction */}
        <section>
          <p style={sectionHead}>Introduction</p>
          <label style={labelSt}>About You</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            rows={4}
            placeholder="Write a brief introduction about yourself..."
            style={{ ...baseInput, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
            {...focusHandlers}
          />
        </section>

        {/* Expertise */}
        <section>
          <p style={sectionHead}>Areas of Expertise</p>
          {formData.expertise.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {formData.expertise.map((item, i) => (
                <TagPill key={i} label={item} onRemove={() => removeTag('expertise', i)} accent />
              ))}
            </div>
          )}
          <AddRow
            value={newExpertise}
            onChange={setNewExpertise}
            onAdd={() => addTag('expertise', newExpertise, setNewExpertise)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('expertise', newExpertise, setNewExpertise))}
            placeholder="e.g. Machine Learning — press Enter"
          />
        </section>

        {/* Followed Topics */}
        <section>
          <p style={sectionHead}>Followed Topics</p>
          {formData.followedTopics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {formData.followedTopics.map((topic, i) => (
                <TagPill key={i} label={topic} onRemove={() => removeTag('followedTopics', i)} accent={false} />
              ))}
            </div>
          )}
          <AddRow
            value={newTopic}
            onChange={setNewTopic}
            onAdd={() => addTag('followedTopics', newTopic, setNewTopic)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('followedTopics', newTopic, setNewTopic))}
            placeholder="e.g. Climate Policy — press Enter"
          />
        </section>

        {/* Form actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: `1px solid ${c.border}` }}>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: c.textError, border: `1px solid #6b2227`, borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2a0a0d'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash size={14} /> Delete Account
          </button>
          <button
            type="submit"
            disabled={isSaving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isSaving ? c.btnDisabled : c.btnPrimary, color: c.textOnColor, border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => !isSaving && (e.currentTarget.style.background = c.btnPrimaryHover)}
            onMouseLeave={e => !isSaving && (e.currentTarget.style.background = c.btnPrimary)}
          >
            {isSaving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '420px', background: c.brand950grey, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '28px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '600', color: c.textPrimary, margin: '0 0 8px' }}>Delete Account</h3>
            <p style={{ fontSize: '13px', color: c.textSecondary, lineHeight: '1.6', margin: '0 0 24px' }}>
              This is permanent and cannot be undone. All your data, profile, and access will be removed immediately.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, background: 'transparent', color: c.brand400grey, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = c.field}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, background: c.btnDanger, color: c.textOnColor, border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b01920'}
                onMouseLeave={e => e.currentTarget.style.background = c.btnDanger}
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AccountSettings;