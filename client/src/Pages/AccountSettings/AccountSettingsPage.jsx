import React, { useContext, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, CreditCard, Shield, Globe, ChevronRight, Menu, X } from 'lucide-react';
import DataProvider from '../../context/DataProvider.jsx';
import AccountSettings    from '../../components/AccountSettings/AccountSettings.jsx';
import BillingSettings    from '../../components/AccountSettings/BillingSettings.jsx';
import MFASettings        from '../../components/AccountSettings/MFASettings.jsx';
import FellowProfileSettings from '../../components/AccountSettings/FellowProfileSettings.jsx';

/* ─── Design tokens ───────────────────────────────────────────────── */
const c = {
  bg:              '#000000',
  bgSecondary:     '#474646',
  field:           '#393939',
  fieldHover:      '#474747',
  border:          '#525252',
  brand950grey:    '#262626',
  brand800grey:    '#474646',
  brand600grey:    '#888888',
  brand400grey:    '#adadad',
  brand200grey:    '#d9d9d9',
  textPrimary:     '#ffffff',
  textSecondary:   '#9f9f9f',
  textDisabled:    '#aaa7a7',
  textOnColor:     '#ffffff',
  btnPrimary:      '#105abd',
  btnPrimaryHover: '#062c65',
  brandBlue:       '#004aad',
  brandBlue2:      '#062c65',
  brandBlue600:    '#0079ff',
};

const NAV_ITEMS = [
  { label: 'Account Details', path: 'account',  icon: User,       desc: 'Name, email & preferences' },
  { label: 'Billing',         path: 'billing',  icon: CreditCard, desc: 'Payment method'             },
  { label: 'Security',        path: 'security', icon: Shield,      desc: 'Two-factor authentication'  },
  { label: 'Public Profile',  path: 'profile',  icon: Globe,       desc: 'Your fellow profile'        },
];

/* ─── Sidebar nav item ────────────────────────────────────────────── */
const SideNavItem = ({ item, isActive, isLast }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${c.border}`,
        background: isActive ? c.brandBlue2 : 'transparent',
        color: isActive ? c.textPrimary : c.brand400grey,
        textDecoration: 'none',
        position: 'relative',
        transition: 'background 0.15s, color 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => !isActive && (e.currentTarget.style.background = c.brand950grey)}
      onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
    >
      {/* Left accent bar */}
      {isActive && (
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '3px', height: '32px', background: c.brandBlue600,
          borderRadius: '0 3px 3px 0',
        }} />
      )}

      {/* Icon */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
        background: isActive ? 'rgba(255,255,255,0.1)' : c.field,
        transition: 'background 0.15s',
      }}>
        <Icon size={16} style={{ color: isActive ? c.textPrimary : c.brand400grey }} />
      </div>

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: isActive ? c.textPrimary : c.brand200grey, lineHeight: 1.2 }}>
          {item.label}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '11px', color: isActive ? 'rgba(255,255,255,0.55)' : c.brand600grey, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.desc}
        </p>
      </div>

      <ChevronRight size={14} style={{ flexShrink: 0, color: isActive ? 'rgba(255,255,255,0.4)' : c.field, transition: 'transform 0.15s' }} />
    </NavLink>
  );
};

/* ─── Main layout ─────────────────────────────────────────────────── */
const AccountSettingsPage = () => {
  const { account } = useContext(DataProvider.DataContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = NAV_ITEMS.find(item => location.pathname.endsWith(item.path));

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.textPrimary, fontFamily: 'inherit' }}>

      {/* ── Page header ── */}
      <div style={{ borderBottom: `1px solid ${c.border}`, background: c.brand950grey }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: c.textPrimary, margin: 0 }}>Settings</h1>
              <p style={{ fontSize: '13px', color: c.textSecondary, margin: '4px 0 0' }}>
                Manage your account, security, and public profile
              </p>
            </div>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              style={{ display: 'none', alignItems: 'center', gap: '6px', background: c.field, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '8px 12px', color: c.textPrimary, fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              className="settings-mobile-toggle"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              {activeItem?.label || 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* ── Sidebar ── */}
          <aside style={{ width: '240px', flexShrink: 0 }} className="settings-sidebar">
            {/* Nav card */}
            <div style={{ border: `1px solid ${c.border}`, borderRadius: '8px', overflow: 'hidden', background: c.brand950grey }}>
              {NAV_ITEMS.map((item, i) => {
                const isActive = location.pathname.endsWith(item.path);
                return (
                  <SideNavItem
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    isLast={i === NAV_ITEMS.length - 1}
                  />
                );
              })}
            </div>

            {/* Help card */}
            <div style={{ marginTop: '16px', border: `1px solid ${c.border}`, borderRadius: '8px', padding: '16px', background: c.brand950grey }}>
              <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: c.brand200grey }}>Need help?</p>
              <p style={{ margin: '0 0 10px', fontSize: '12px', color: c.textSecondary, lineHeight: '1.5' }}>
                For account or billing questions, reach out to our support team.
              </p>
              <a
                href="mailto:support@thedigitialeconomist.com"
                style={{ fontSize: '12px', fontWeight: '600', color: c.brandBlue600, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                support@thedigitialeconomist.com
              </a>
            </div>
          </aside>

          {/* ── Content panel ── */}
          <main style={{ flex: 1, minWidth: 0, border: `1px solid ${c.border}`, borderRadius: '8px', background: c.brand950grey, padding: '32px' }}>
            <Routes>
              <Route index element={<Navigate to="account" replace />} />
              <Route path="account"  element={<AccountSettings user={account} onUpdateSuccess={() => {}} />} />
              <Route path="billing"  element={<BillingSettings user={account} />} />
              <Route path="security" element={<MFASettings />} />
              <Route path="profile"  element={<FellowProfileSettings user={account} />} />
              <Route path="*"        element={<Navigate to="account" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* ── Mobile styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .settings-sidebar {
            display: none !important;
          }
          .settings-mobile-toggle {
            display: inline-flex !important;
          }
        }

        /* Mobile nav drawer when open */
        .settings-sidebar.mobile-open {
          display: block !important;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 40;
          width: 100%;
          background: ${c.bg};
          padding: 24px;
          overflow-y: auto;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Responsive: stack on small screens */
        @media (max-width: 768px) {
          div[style*="display: flex"][style*="gap: 28px"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountSettingsPage;