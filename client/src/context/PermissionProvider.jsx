import { createContext, useState, useContext, useCallback, useMemo } from 'react';
import axiosInstance from '../config/apiConfig';
import DataProvider from './DataProvider';

/**
 * PermissionContext
 * Stores the current user's resolved permission map.
 * Shape: { apply_fellowship: true, verify_users: false, ... }
 *
 * This context is populated by calling fetchPermissions() once after login.
 * It is cleared on logout.
 */
export const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
    const [permissions, setPermissions] = useState({});
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [permissionsReady, setPermissionsReady] = useState(false);

    /**
     * fetchPermissions
     * Calls GET /api/roles/my-permissions and stores the result.
     * Call this once after the user is confirmed logged in.
     */
    const fetchPermissions = useCallback(async () => {
        try {
            setPermissionsLoading(true);
            const res = await axiosInstance.get('/api/roles/my-permissions');
            const permMap = res.data.data || {};
            setPermissions(permMap);
            setPermissionsReady(true);
        } catch (err) {
            console.error('Failed to fetch permissions:', err);
            // On failure, default to empty — all permission checks will return false
            setPermissions({});
            setPermissionsReady(true);
        } finally {
            setPermissionsLoading(false);
        }
    }, []);

    /**
     * clearPermissions
     * Call this on logout to wipe the permission map.
     */
    const clearPermissions = useCallback(() => {
        setPermissions({});
        setPermissionsReady(false);
    }, []);

    const value = useMemo(() => ({
        permissions,
        permissionsLoading,
        permissionsReady,
        fetchPermissions,
        clearPermissions,
    }), [permissions, permissionsLoading, permissionsReady, fetchPermissions, clearPermissions]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export default { PermissionContext, PermissionProvider };