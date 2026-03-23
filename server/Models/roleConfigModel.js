import mongoose from 'mongoose';

/**
 * RoleConfig
 * Stores the permission configuration for each role.
 * One document per role. Each document contains a map of
 * permissionKey -> boolean (enabled/disabled).
 *
 * Example document:
 * {
 *   role: 'core',
 *   permissions: {
 *     access_admin_dashboard: true,
 *     verify_users: true,
 *     manage_fellowships: true,
 *     change_roles_permissions: false,
 *     apply_fellowship: true,
 *     ...
 *   },
 *   lastUpdatedBy: ObjectId('...'),  // admin who last changed this
 * }
 */
const roleConfigSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            unique: true,
            enum: ['admin', 'core', 'chair', 'user'],
        },
        permissions: {
            type: Map,
            of: Boolean,
            default: {},
            // Dynamic map: permissionKey (string) -> enabled (boolean)
            // Using Map allows adding new permissions without schema changes.
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            // Audit trail: which admin last modified this role's config
        },
    },
    { timestamps: true }
);

roleConfigSchema.index({ role: 1 });

const roleConfigModel = mongoose.model('RoleConfig', roleConfigSchema);
export default roleConfigModel;