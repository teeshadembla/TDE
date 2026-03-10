import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Users, Crown, UserCheck, Shield, ToggleLeft, ToggleRight, Save, RotateCcw, AlertCircle, Check, Lock } from 'lucide-react';
import DataProvider from '../../context/DataProvider';
import axiosInstance from '../../config/apiConfig';

// ─── Role metadata ────────────────────────────────────────────────────────────
const ROLE_META = {
  admin: {
    label: 'Admin',
    description: 'Full system access. Assigned only via backend.',
    icon: Crown,
    color: '#105abd',
    accent: '#004aad',
    bg: 'rgba(0,74,173,0.06)',
    border: 'rgba(0,74,173,0.25)',
    locked: true,
  },
  core: {
    label: 'Core Member',
    description: 'Elevated access. Assigned during user verification.',
    icon: ShieldCheck,
    color: '#062c65',
    accent: '#062c65',
    bg: 'rgba(6,44,101,0.06)',
    border: 'rgba(6,44,101,0.2)',
    locked: false,
  },
  chair: {
    label: 'Chair',
    description: 'Leadership role. Assigned during user verification.',
    icon: UserCheck,
    color: '#105abd',
    accent: '#105abd',
    bg: 'rgba(16,90,189,0.06)',
    border: 'rgba(16,90,189,0.2)',
    locked: false,
  },
  user: {
    label: 'User',
    description: 'Default role assigned to all new accounts.',
    icon: Users,
    color: '#888',
    accent: '#555',
    bg: 'rgba(136,136,136,0.06)',
    border: 'rgba(136,136,136,0.2)',
    locked: false,
  },
};

const ROLE_ORDER = ['admin', 'core', 'chair', 'user'];

// ─── Permission group labels ──────────────────────────────────────────────────
const GROUP_META = {
  page_access: { label: 'Page Access', description: 'Which pages this role can navigate to' },
  features:    { label: 'Feature Permissions', description: 'Granular actions this role can perform' },
};

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ enabled, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#1f1f1f' : enabled ? '#004aad' : '#2a2a2a',
        position: 'relative', transition: 'background-color 0.2s ease',
        flexShrink: 0,
        outline: 'none',
      }}
      aria-label={enabled ? 'Disable' : 'Enable'}
    >
      <span style={{
        position: 'absolute', top: 3, left: enabled ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        backgroundColor: disabled ? '#444' : enabled ? '#fff' : '#555',
        transition: 'left 0.2s ease',
      }} />
    </button>
  );
}

// ─── Permission row ───────────────────────────────────────────────────────────
function PermissionRow({ permission, enabled, onChange, locked }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 6,
        backgroundColor: hovered && !locked ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background-color 0.15s',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 500, color: locked ? '#444' : '#ccc', letterSpacing: '-0.01em' }}>
          {permission.label}
        </p>
        {permission.description && (
          <p style={{ margin: '2px 0 0', fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#444', lineHeight: 1.4 }}>
            {permission.description}
          </p>
        )}
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={locked} />
    </div>
  );
}

// ─── Permissions panel for a role ─────────────────────────────────────────────
function RolePermissionsPanel({ role, permissions, rolePermissions, onChange, saving, onSave, onReset, hasChanges }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;

  const grouped = {};
  permissions.forEach(p => {
    if (!grouped[p.group]) grouped[p.group] = [];
    grouped[p.group].push(p);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Panel header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid #1a1a1a',
        background: meta.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: meta.bg, border: `1.5px solid ${meta.border}`,
            }}>
              <Icon size={22} color={meta.color} strokeWidth={1.6} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#f5f5f5', letterSpacing: '-0.02em' }}>
                {meta.label}
              </h2>
              <p style={{ margin: '3px 0 0', fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#555' }}>
                {meta.description}
              </p>
            </div>
          </div>

          {meta.locked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid #222' }}>
              <Lock size={12} color="#555" />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#555', fontWeight: 600 }}>NON-EDITABLE</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onReset}
                disabled={!hasChanges || saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 6, border: '1px solid #2a2a2a',
                  backgroundColor: 'transparent', cursor: hasChanges ? 'pointer' : 'not-allowed',
                  color: hasChanges ? '#888' : '#333', fontFamily: 'Montserrat, sans-serif',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  opacity: hasChanges ? 1 : 0.5,
                }}
                onMouseEnter={e => hasChanges && (e.currentTarget.style.borderColor = '#444')}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <RotateCcw size={13} />
                Reset
              </button>
              <button
                onClick={onSave}
                disabled={!hasChanges || saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 6, border: 'none',
                  backgroundColor: hasChanges ? meta.accent : '#1a1a1a',
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  color: hasChanges ? '#fff' : '#333',
                  fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700,
                  transition: 'all 0.2s', opacity: hasChanges ? 1 : 0.5,
                }}
              >
                {saving ? (
                  <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} /> Saving...</>
                ) : (
                  <><Save size={13} /> Save Changes</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Permission groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 28px' }}>
        {permissions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
            <AlertCircle size={28} color="#333" strokeWidth={1.5} />
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#444', margin: 0 }}>
              No permissions configured yet.
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#333', margin: 0 }}>
              Permissions will appear here once defined in the backend.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupKey, perms]) => (
            <div key={groupKey} style={{ marginBottom: 28 }}>
              <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #161616' }}>
                <h3 style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {GROUP_META[groupKey]?.label || groupKey}
                </h3>
                {GROUP_META[groupKey]?.description && (
                  <p style={{ margin: '3px 0 0', fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#3a3a3a' }}>
                    {GROUP_META[groupKey].description}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {perms.map(p => (
                  <PermissionRow
                    key={p.key}
                    permission={p}
                    enabled={!!rolePermissions[p.key]}
                    onChange={(val) => onChange(p.key, val)}
                    locked={meta.locked}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const RolePermissions = () => {
  const navigate = useNavigate();
  const { account } = useContext(DataProvider.DataContext);

  const [selectedRole, setSelectedRole] = useState('core');
  const [permissions, setPermissions] = useState([]);        // master list from backend
  const [roleConfigs, setRoleConfigs] = useState({});        // { role: { permKey: bool } }
  const [originalConfigs, setOriginalConfigs] = useState({}); // snapshot for reset
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Guard: only admin can access this page
  useEffect(() => {
    if (account._id && account.role !== 'admin') {
      navigate('/user/profile');
    }
  }, [account]);

  // Fetch permissions list + current role configs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [permsRes, configsRes] = await Promise.all([
          axiosInstance.get('/api/roles/permissions'),
          axiosInstance.get('/api/roles/configs'),
        ]);

        const permsData = permsRes.data.data || [];
        const configsData = configsRes.data.data || {};

        setPermissions(permsData);

        // Build a complete map: for each role, map permKey -> bool
        const built = {};
        ROLE_ORDER.forEach(role => {
          built[role] = {};
          permsData.forEach(p => {
            built[role][p.key] = configsData[role]?.[p.key] ?? false;
          });
        });

        setRoleConfigs(built);
        setOriginalConfigs(JSON.parse(JSON.stringify(built)));
      } catch (err) {
        // If backend isn't built yet, show empty state gracefully
        setError(null);
        setPermissions([]);
        setRoleConfigs({ admin: {}, core: {}, chair: {}, user: {} });
        setOriginalConfigs({ admin: {}, core: {}, chair: {}, user: {} });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePermissionChange = (role, permKey, value) => {
    setRoleConfigs(prev => ({
      ...prev,
      [role]: { ...prev[role], [permKey]: value },
    }));
    setSaveSuccess(null);
  };

  const hasChanges = (role) => {
    const current = roleConfigs[role] || {};
    const original = originalConfigs[role] || {};
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const handleReset = (role) => {
    setRoleConfigs(prev => ({
      ...prev,
      [role]: JSON.parse(JSON.stringify(originalConfigs[role] || {})),
    }));
    setSaveSuccess(null);
  };

  const handleSave = async (role) => {
    try {
      setSaving(true);
      await axiosInstance.put(`/api/roles/configs/${role}`, {
        permissions: roleConfigs[role],
      });
      setOriginalConfigs(prev => ({
        ...prev,
        [role]: JSON.parse(JSON.stringify(roleConfigs[role])),
      }));
      setSaveSuccess(role);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save. Please try again.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '2px solid #1a1a1a', borderTopColor: '#004aad', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#444', margin: 0 }}>Loading role configuration...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        height: 60, backgroundColor: '#0a0a0a', borderBottom: '1px solid #141414',
        display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            background: 'none', border: '1px solid #1f1f1f', borderRadius: 6, cursor: 'pointer', color: '#666',
            fontFamily: 'Montserrat, sans-serif', fontSize: 12, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#ccc'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.color = '#666'; }}
        >
          <ChevronLeft size={14} />
          Back
        </button>

        <div style={{ width: 1, height: 20, backgroundColor: '#1a1a1a' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={16} color="#004aad" strokeWidth={1.8} />
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f0', letterSpacing: '-0.01em' }}>
            Roles & Permissions
          </span>
        </div>

        {/* Toast notifications */}
        {saveSuccess && (
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6,
            backgroundColor: 'rgba(0,74,173,0.1)', border: '1px solid rgba(0,74,173,0.3)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <Check size={13} color="#105abd" />
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#105abd', fontWeight: 600 }}>
              {ROLE_META[saveSuccess]?.label} permissions saved
            </span>
          </div>
        )}

        {error && (
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6,
            backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          }}>
            <AlertCircle size={13} color="#f87171" />
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#f87171', fontWeight: 600 }}>
              {error}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Role selector sidebar */}
        <div style={{
          width: 240, backgroundColor: '#0a0a0a', borderRight: '1px solid #141414',
          padding: '20px 0', flexShrink: 0, overflowY: 'auto',
        }}>
          <p style={{ padding: '0 18px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
            Roles
          </p>
          {ROLE_ORDER.map(role => {
            const meta = ROLE_META[role];
            const Icon = meta.icon;
            const active = selectedRole === role;
            const changed = hasChanges(role);

            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 18px', background: 'none', border: 'none',
                  borderLeft: active ? `2px solid ${meta.accent}` : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                  backgroundColor: active ? meta.bg : 'transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Icon size={16} color={active ? meta.color : '#444'} strokeWidth={1.7} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#f0f0f0' : '#555', letterSpacing: '-0.01em' }}>
                    {meta.label}
                  </p>
                </div>
                {changed && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: meta.accent, flexShrink: 0 }} title="Unsaved changes" />
                )}
                {meta.locked && (
                  <Lock size={11} color="#333" />
                )}
              </button>
            );
          })}

          {/* Legend */}
          <div style={{ margin: '24px 18px 0', padding: '14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #161616' }}>
            <p style={{ margin: '0 0 8px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legend</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#004aad' }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#444' }}>Unsaved changes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Lock size={11} color="#333" />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#444' }}>Non-editable role</span>
            </div>
          </div>
        </div>

        {/* Permissions panel */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#080808' }}>
          <RolePermissionsPanel
            role={selectedRole}
            permissions={permissions}
            rolePermissions={roleConfigs[selectedRole] || {}}
            onChange={(permKey, val) => handlePermissionChange(selectedRole, permKey, val)}
            saving={saving}
            onSave={() => handleSave(selectedRole)}
            onReset={() => handleReset(selectedRole)}
            hasChanges={hasChanges(selectedRole)}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default RolePermissions;