import permissionModel from '../Models/permissionModel.js';
import roleConfigModel from '../Models/roleConfigModel.js';
import logger from '../utils/logger.js';

// ─── GET /api/roles/permissions ───────────────────────────────────────────────
// Returns the master list of all permissions.
// Used by the frontend Roles & Permissions page to render toggles.
export const getPermissions = async (req, res) => {
    try {
        const permissions = await permissionModel.find({}).sort({ group: 1, key: 1 });
        logger.debug({ count: permissions.length }, 'Permissions list fetched');
        return res.status(200).json({ data: permissions });
    } catch (err) {
        logger.error({ errorMsg: err.message, stack: err.stack }, 'Error fetching permissions');
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// ─── GET /api/roles/configs ───────────────────────────────────────────────────
// Returns all role configs as a flat object: { role: { permKey: bool } }
// Used by the frontend to populate the toggle states for all roles.
export const getRoleConfigs = async (req, res) => {
    try {
        const configs = await roleConfigModel.find({});

        // Convert to plain object: { admin: { key: bool }, core: { key: bool }, ... }
        const result = {};
        configs.forEach(config => {
            // config.permissions is a Mongoose Map — convert to plain object
            result[config.role] = Object.fromEntries(config.permissions);
        });

        logger.debug({ roles: Object.keys(result) }, 'Role configs fetched');
        return res.status(200).json({ data: result });
    } catch (err) {
        logger.error({ errorMsg: err.message, stack: err.stack }, 'Error fetching role configs');
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// ─── PUT /api/roles/configs/:role ─────────────────────────────────────────────
// Updates the permission config for a specific role.
// Body: { permissions: { permKey: bool, ... } }
// Only admin can call this (enforced by requirePermission middleware on the route).
export const updateRoleConfig = async (req, res) => {
    try {
        const { role } = req.params;
        const { permissions } = req.body;

        const validRoles = ['admin', 'core', 'chair', 'user'];
        if (!validRoles.includes(role)) {
            logger.warn({ role }, 'Invalid role in updateRoleConfig');
            return res.status(400).json({ msg: `Invalid role: ${role}` });
        }

        // Prevent editing admin role config — admin always has all permissions
        // enforced at middleware level, but double-check here too
        if (role === 'admin') {
            logger.warn({ userId: req.user?.userId }, 'Attempt to modify admin role config blocked');
            return res.status(403).json({ msg: 'Admin role permissions cannot be modified' });
        }

        if (!permissions || typeof permissions !== 'object') {
            return res.status(400).json({ msg: 'permissions object is required' });
        }

        // Validate that all keys in the payload are real permissions
        const allPermissions = await permissionModel.find({}, 'key');
        const validKeys = new Set(allPermissions.map(p => p.key));

        const invalidKeys = Object.keys(permissions).filter(k => !validKeys.has(k));
        if (invalidKeys.length > 0) {
            logger.warn({ invalidKeys }, 'Invalid permission keys in update payload');
            return res.status(400).json({
                msg: `Invalid permission keys: ${invalidKeys.join(', ')}`
            });
        }

        // Update only the keys provided — don't wipe keys not in the payload
        const updateOps = {};
        Object.entries(permissions).forEach(([key, value]) => {
            updateOps[`permissions.${key}`] = Boolean(value);
        });

        const updated = await roleConfigModel.findOneAndUpdate(
            { role },
            {
                $set: {
                    ...updateOps,
                    lastUpdatedBy: req.user.userId,
                },
            },
            { new: true }
        );

        if (!updated) {
            logger.warn({ role }, 'RoleConfig not found for update');
            return res.status(404).json({ msg: `No config found for role: ${role}` });
        }

        logger.info(
            { role, updatedBy: req.user.userId, changedKeys: Object.keys(permissions) },
            'Role config updated successfully'
        );

        return res.status(200).json({
            msg: `Permissions for ${role} updated successfully`,
            data: Object.fromEntries(updated.permissions),
        });
    } catch (err) {
        logger.error({ errorMsg: err.message, stack: err.stack }, 'Error updating role config');
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// ─── GET /api/roles/my-permissions ───────────────────────────────────────────
// Returns the calling user's resolved permission set.
// Called once on login by the frontend to populate the permission context.
// Admin always gets all permissions regardless of stored config.
export const getMyPermissions = async (req, res) => {
    try {
        const { role } = req.user;

        // Admin always gets every permission — never rely on stored config
        if (role === 'admin') {
            const allPermissions = await permissionModel.find({}, 'key');
            const permMap = {};
            allPermissions.forEach(p => { permMap[p.key] = true; });
            logger.debug({ userId: req.user.userId, role }, 'Admin permissions resolved (all true)');
            return res.status(200).json({ data: permMap });
        }

        const config = await roleConfigModel.findOne({ role });

        if (!config) {
            logger.warn({ role }, 'No RoleConfig found for role — returning empty permissions');
            return res.status(200).json({ data: {} });
        }

        const permMap = Object.fromEntries(config.permissions);
        logger.debug({ userId: req.user.userId, role }, 'User permissions resolved');
        return res.status(200).json({ data: permMap });
    } catch (err) {
        logger.error({ errorMsg: err.message, stack: err.stack }, 'Error fetching user permissions');
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};