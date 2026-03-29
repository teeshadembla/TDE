import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataProvider from '../context/DataProvider';
import { useClerk } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { X, Settings, Calendar, LayoutDashboard, ShieldCheck, ChevronRight } from 'lucide-react';
import { PermissionContext } from '../context/PermissionProvider';
import usePermission from '../hooks/usePermission';

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  textInverse:   '#161616',
  grey600:       '#888',
  blue:          '#004aad',
  blue2nd:       '#062c65',
  buttonHover:   '#062c65',
  buttonPrimary: '#105abd',
};

export default function ProfileDrawer() {
  const [open, setOpen] = React.useState(false);
  const { account, setAccount } = React.useContext(DataProvider.DataContext);
  const { clearPermissions } = React.useContext(PermissionContext);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const canAccessAdminDashboard = usePermission('access_admin_dashboard');
  const canManageRoles = usePermission('change_roles_permissions');

  const goToDashboard = () => {
    canAccessAdminDashboard
      ? navigate('/admin/profile')
      : navigate('/user/profile');
    setOpen(false);
  };

  const goToUserProfile = () => {
    navigate('/user/profile');
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      clearPermissions();
      setAccount({ _id: "", name: "", email: "", role: "", profilePicture: "" });
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  // White-section nav items
  const whiteNavItems = [
    {
      icon: Calendar,
      label: 'Upcoming Events',
      action: () => { navigate('/events'); setOpen(false); },
    },
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      action: goToDashboard,
    },
    {
      icon: Settings,
      label: 'Account Settings',
      action: () => { navigate('/settings'); setOpen(false); },
    },
    ...(canManageRoles ? [{
      icon: ShieldCheck,
      label: 'Manage Roles & Permissions',
      action: () => { navigate('/admin/roles'); setOpen(false); },
      highlight: true,
    }] : []),
  ];

  // Black-section items
  const blackNavItems = [
    { label: 'Sign out',  action: () => { handleLogout() } },
    { label: 'Privacy',   action: () => { navigate('/privacy-policy'); setOpen(false); } },
  ];

  const DrawerContent = (
    <Box sx={{ width: 420, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── WHITE TOP SECTION ───────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#ffffff', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {/* Top bar: X (close) left, profile icon right */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 10px',
        }}>
          <button
            onClick={toggleDrawer(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Close drawer"
          >
            <X size={22} strokeWidth={2} color={B.textInverse} />
          </button>

          {/* Profile icon top-right → /user/profile */}
          <button
            onClick={goToUserProfile}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Go to profile"
          >
            <AccountCircleIcon sx={{ color: B.textInverse, fontSize: 30 }} />
          </button>
        </div>

        {/* Profile card — blue gradient, full-width, clickable */}
        <div style={{ padding: '4px 16px 6px' }}>
          <button
            onClick={goToDashboard}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 18,
              padding: '20px 22px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: `linear-gradient(125deg, ${B.blue} 0%, ${B.blue2nd} 100%)`,
              transition: 'filter 0.2s ease',
              textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            {/* Avatar */}
            <div style={{
              width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
              border: '2.5px solid rgba(255,255,255,0.35)',
              overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {account.profilePicture ? (
                <img
                  src={account.profilePicture}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{
                  fontSize: 22, color: '#fff',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                }}>
                  {(account.FullName || account.name || '?')[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Label + name */}
            <div style={{ minWidth: 0 }}>
              <p style={{
                margin: '0 0 3px',
                fontFamily: 'Montserrat, sans-serif', fontSize: 11,
                fontWeight: 500, color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Profile
              </p>
              <p style={{
                margin: 0,
                fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                fontSize: 20, color: '#ffffff', letterSpacing: '-0.02em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {account.FullName || account.name || 'User'}
              </p>
            </div>
          </button>
        </div>

        {/* White nav items */}
        <div style={{ padding: '10px 8px 20px', flex: 1, overflowY: 'auto' }}>
          {whiteNavItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 8, transition: 'background 0.15s',
                  textAlign: 'left',
                  borderLeft: item.highlight ? `3px solid ${B.blue}` : '3px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = item.highlight
                    ? 'rgba(0,74,173,0.07)'
                    : 'rgba(0,0,0,0.045)';
                }}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  color={item.highlight ? B.blue : B.textInverse}
                />
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 14,
                  fontWeight: item.highlight ? 600 : 500,
                  color: item.highlight ? B.blue : B.textInverse,
                  flex: 1,
                }}>
                  {item.label}
                </span>
                <ChevronRight
                  size={15}
                  strokeWidth={2}
                  color={item.highlight ? B.blue : B.grey600}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BLACK BOTTOM SECTION ────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#000000',
        padding: '10px 8px 28px',
        flexShrink: 0,
      }}>
        {blackNavItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '13px 16px', background: 'none', border: 'none',
              cursor: 'pointer', borderRadius: 8,
              transition: 'background 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#ffffff',
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

    </Box>
  );

  return (
    <div className='w-10 mb-1 ml-1'>
      <Button onClick={toggleDrawer(true)}>
        <AccountCircleIcon sx={{ color: 'white' }} fontSize='large' />
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: '#ffffff', overflow: 'hidden' } }}
      >
        {DrawerContent}
      </Drawer>
    </div>
  );
}