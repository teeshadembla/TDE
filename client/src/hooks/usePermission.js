import { useContext } from 'react';
import { PermissionContext } from '../context/PermissionProvider';
import DataProvider from '../context/DataProvider';

/**
 * usePermission(permissionKey)
 *
 * Returns true if the current user has the given permission enabled.
 *
 * Usage:
 *   const canVerify = usePermission('verify_users');
 *   const canManage = usePermission('manage_fellowships');
 *
 *   {canVerify && <VerifyButton />}
 *
 * Special cases:
 * - Admin always returns true for any key (matches backend behaviour)
 * - If permissions haven't loaded yet, returns false (safe default)
 * - If the key doesn't exist in the map, returns false
 */
const usePermission = (permissionKey) => {
    const { account } = useContext(DataProvider.DataContext);
    const { permissions } = useContext(PermissionContext);

    // Admin always has every permission — mirrors backend logic
    if (account?.role === 'admin') return true;

    // Permissions not loaded yet — deny by default
    if (!permissions || Object.keys(permissions).length === 0) return false;

    return permissions[permissionKey] === true;
};

export default usePermission;


/**
 * usePermissions()
 *
 * Returns the full permissions map and a hasPermission() checker function.
 * Use this when you need to check multiple permissions in one component
 * without calling usePermission() multiple times.
 *
 * Usage:
 *   const { hasPermission, permissionsReady } = usePermissions();
 *
 *   if (!permissionsReady) return <Spinner />;
 *
 *   const canVerify = hasPermission('verify_users');
 *   const canManage = hasPermission('manage_fellowships');
 */
export const usePermissions = () => {
    const { account } = useContext(DataProvider.DataContext);
    const { permissions, permissionsLoading, permissionsReady } = useContext(PermissionContext);

    const hasPermission = (permissionKey) => {
        if (account?.role === 'admin') return true;
        if (!permissions || Object.keys(permissions).length === 0) return false;
        return permissions[permissionKey] === true;
    };

    return {
        hasPermission,
        permissions,
        permissionsLoading,
        permissionsReady,
    };
};