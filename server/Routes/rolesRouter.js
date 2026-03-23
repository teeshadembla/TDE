import express from 'express';
import {
    getPermissions,
    getRoleConfigs,
    updateRoleConfig,
    getMyPermissions,
} from '../Controllers/rolesController.js';
import authenticateToken from '../Controllers/tokenControllers.js';
import requirePermission from '../middleware/requirePermission.js';

const rolesRouter = express.Router();

// ── Public to authenticated users ─────────────────────────────────────────────

// GET /api/roles/my-permissions
// Called once on login — returns the current user's resolved permission map.
// Any logged-in user can call this for their own permissions.
rolesRouter.get('/my-permissions', authenticateToken, getMyPermissions);

// ── Admin-only endpoints ──────────────────────────────────────────────────────
// These require both authentication AND the change_roles_permissions permission.

// GET /api/roles/permissions
// Returns the master list of all permissions (for the admin UI toggles).
rolesRouter.get(
    '/permissions',
    authenticateToken,
    requirePermission('change_roles_permissions'),
    getPermissions
);

// GET /api/roles/configs
// Returns all role configs as { role: { permKey: bool } }.
rolesRouter.get(
    '/configs',
    authenticateToken,
    requirePermission('change_roles_permissions'),
    getRoleConfigs
);

// PUT /api/roles/configs/:role
// Updates a specific role's permission config.
// Body: { permissions: { permKey: bool, ... } }
rolesRouter.put(
    '/configs/:role',
    authenticateToken,
    requirePermission('change_roles_permissions'),
    updateRoleConfig
);

export default rolesRouter;