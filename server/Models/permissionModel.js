import mongoose from 'mongoose';

/**
 * Permission
 * Represents a single named permission that exists in the system.
 * This is the master list — it defines WHAT permissions exist.
 * Which roles have which permissions is stored in RoleConfig.
 */
const permissionSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // e.g. 'access_admin_dashboard', 'verify_users'
        },
        label: {
            type: String,
            required: true,
            trim: true,
            // Human-readable name shown in the admin UI
            // e.g. 'Access Admin Dashboard'
        },
        description: {
            type: String,
            default: '',
            trim: true,
            // Optional explanation shown as subtext in the admin UI
        },
        group: {
            type: String,
            required: true,
            enum: ['registered_features', 'fellow_features', 'admin_features', 'super_admin'],
            // Groups permissions into sections in the admin UI
        },
        isSystem: {
            type: Boolean,
            default: false,
            // If true, this permission cannot be deleted via the API.
            // Protects core permissions like 'change_roles_permissions'
            // from being accidentally removed.
        },
    },
    { timestamps: true }
);

permissionSchema.index({ key: 1 });
permissionSchema.index({ group: 1 });

const permissionModel = mongoose.model('Permission', permissionSchema);
export default permissionModel;