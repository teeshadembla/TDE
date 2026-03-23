import roleConfigModel from '../Models/roleConfigModel.js';
import logger from '../utils/logger.js';

/**
 * requirePermission(permissionKey)
 *
 * Express middleware factory. Returns a middleware that checks whether
 * the currently authenticated user's role has the given permission enabled.
 *
 * Usage on a route:
 *   router.post('/verify-user/:id',
 *     authenticateToken,
 *     requirePermission('verify_users'),
 *     verifyUserByAdmin
 *   );
 *
 * How it works:
 * 1. Reads req.user.role (attached by authenticateToken / enrichUserData)
 * 2. Admin role always passes — no DB lookup needed
 * 3. For all other roles, fetches the RoleConfig from DB and checks the key
 * 4. Returns 403 if the permission is false or missing
 *
 * The RoleConfig lookup is fast because:
 * - roleConfigModel has an index on `role`
 * - There are only 4 documents in the collection (one per role)
 * - In a future optimisation this can be cached in-memory / Redis
 */
const requirePermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            // requirePermission must come after authenticateToken
            if (!req.user) {
                logger.warn(
                    { permissionKey },
                    'requirePermission called without prior authentication middleware'
                );
                return res.status(401).json({
                    msg: 'Authentication required',
                });
            }

            const { role, userId } = req.user;

            // Admin always has every permission — short circuit
            if (role === 'admin') {
                logger.debug({ userId, permissionKey }, 'Admin bypasses permission check');
                return next();
            }

            // Fetch the role config for this role
            const config = await roleConfigModel.findOne({ role });

            if (!config) {
                logger.warn(
                    { role, permissionKey },
                    'No RoleConfig found — denying access'
                );
                return res.status(403).json({
                    msg: 'Access denied: role configuration not found',
                });
            }

            const hasPermission = config.permissions.get(permissionKey) === true;

            if (!hasPermission) {
                logger.warn(
                    { userId, role, permissionKey },
                    'Permission denied'
                );
                return res.status(403).json({
                    msg: `Access denied: missing permission '${permissionKey}'`,
                    permission: permissionKey,
                });
            }

            logger.debug({ userId, role, permissionKey }, 'Permission granted');
            next();
        } catch (err) {
            logger.error(
                { errorMsg: err.message, stack: err.stack, permissionKey },
                'Error in requirePermission middleware'
            );
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    };
};

export default requirePermission;