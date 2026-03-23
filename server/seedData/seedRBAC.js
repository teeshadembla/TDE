import permissionModel from '../Models/permissionModel.js';
import roleConfigModel from '../Models/roleConfigModel.js';
import logger from '../utils/logger.js';

const PERMISSIONS = [
    // ── registered_features ─────────────────────────────────────────────
    {
        key: 'apply_fellowship',
        label: 'Apply for Fellowship',
        description: 'Can submit a fellowship application',
        group: 'registered_features',
        isSystem: false,
    },
    {
        key: 'apply_events',
        label: 'Apply for Events',
        description: 'Can register for events',
        group: 'registered_features',
        isSystem: false,
    },
    {
        key: 'read_full_publication',
        label: 'Read Full Publication Online',
        description: 'Can read the complete publication in the browser',
        group: 'registered_features',
        isSystem: false,
    },
    {
        key: 'share_publication_link',
        label: 'Share Publication via Link',
        description: 'Can share a direct link to a publication',
        group: 'registered_features',
        isSystem: false,
    },
    {
        key: 'access_profile_settings',
        label: 'Access Profile Settings',
        description: 'Can view and edit their own account settings',
        group: 'registered_features',
        isSystem: false,
    },
    {
        key: 'download_publication',
        label: 'Download Publication',
        description: 'Can download a publication as a file',
        group: 'registered_features',
        isSystem: false,
    },

    // ── fellow_features ──────────────────────────────────────────────────
    {
        key: 'submit_onboarding_form',
        label: 'Submit Onboarding Form',
        description: 'Can complete the post-fellowship-acceptance onboarding form',
        group: 'fellow_features',
        isSystem: false,
    },
    {
        key: 'display_public_profile',
        label: 'Display Public Profile',
        description: 'Has a publicly visible fellow profile on the site',
        group: 'fellow_features',
        isSystem: false,
    },

    // ── admin_features ───────────────────────────────────────────────────
    {
        key: 'access_admin_dashboard',
        label: 'Access Admin Dashboard',
        description: 'Can navigate to and use the admin dashboard',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'moderate_applications',
        label: 'Moderate Fellowship Applications',
        description: 'Can approve, reject, or flag fellowship applications',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'moderate_profiles',
        label: 'Moderate Public Profiles',
        description: 'Can review and manage public fellow profiles',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'verify_users',
        label: 'Verify New Users',
        description: 'Can verify or reject newly registered users',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'manage_fellowships',
        label: 'Manage Fellowships',
        description: 'Can create, edit, and delete fellowships',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'manage_workgroups',
        label: 'Manage Workgroups',
        description: 'Can create, edit, and delete workgroups',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'manage_users',
        label: 'Manage Users',
        description: 'Can view, edit, and manage user accounts',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'manage_events',
        label: 'Manage Events',
        description: 'Can create, edit, and delete events',
        group: 'admin_features',
        isSystem: false,
    },
    {
        key: 'manage_publications',
        label: 'Manage Publications',
        description: 'Can upload, edit, and delete publications',
        group: 'admin_features',
        isSystem: false,
    },
    {
    key: 'view_publication_analytics',
    label: 'View Publication Analytics',
    description: 'Can view view/share/download counts for publications',
    group: 'admin_features',
    isSystem: false,
},

    // ── super_admin ──────────────────────────────────────────────────────
    {
        key: 'change_roles_permissions',
        label: 'Change Roles & Permissions',
        description: 'Can modify which permissions are assigned to each role',
        group: 'super_admin',
        isSystem: true,
    },
];

const DEFAULT_ROLE_PERMISSIONS = {
    admin: {
        apply_fellowship:         true,
        apply_events:             true,
        read_full_publication:    true,
        share_publication_link:   true,
        access_profile_settings:  true,
        download_publication:     true,
        submit_onboarding_form:   true,
        display_public_profile:   true,
        access_admin_dashboard:   true,
        moderate_applications:    true,
        moderate_profiles:        true,
        verify_users:             true,
        manage_fellowships:       true,
        manage_workgroups:        true,
        manage_users:             true,
        change_roles_permissions: true,
        manage_events:        true,
        manage_publications:  true,
    view_publication_analytics:   true, 
    },
    core: {
        apply_fellowship:         true,
        apply_events:             true,
        read_full_publication:    true,
        share_publication_link:   true,
        access_profile_settings:  true,
        download_publication:     true,
        submit_onboarding_form:   true,
        display_public_profile:   true,
        access_admin_dashboard:   true,
        moderate_applications:    true,
        moderate_profiles:        true,
        verify_users:             true,
        manage_fellowships:       true,
        manage_workgroups:        true,
        manage_users:             true,
        change_roles_permissions: false,
        manage_events:        true,
        manage_publications:  true,
    view_publication_analytics:   true, 
    },
    chair: {
        apply_fellowship:         true,
        apply_events:             true,
        read_full_publication:    true,
        share_publication_link:   true,
        access_profile_settings:  true,
        download_publication:     true,  // chairs (fellows) can download
        submit_onboarding_form:   true,
        display_public_profile:   true,
        access_admin_dashboard:   false,
        moderate_applications:    false,
        moderate_profiles:        false,
        verify_users:             false,
        manage_fellowships:       false,
        manage_workgroups:        false,
        manage_users:             false,
        change_roles_permissions: false,
        manage_events:        false,
        manage_publications:  false,
        view_publication_analytics:   false, 
    },
    user: {
        apply_fellowship:         true,
        apply_events:             true,
        read_full_publication:    true,
        share_publication_link:   true,
        access_profile_settings:  true,
        download_publication:     false, // plain users cannot download
        submit_onboarding_form:   false,
        display_public_profile:   false,
        access_admin_dashboard:   false,
        moderate_applications:    false,
        moderate_profiles:        false,
        verify_users:             false,
        manage_fellowships:       false,
        manage_workgroups:        false,
        manage_users:             false,
        change_roles_permissions: false,
        manage_events:        false,
        manage_publications:  false,
        view_publication_analytics:   false, 
    },
};

export const seedRBAC = async () => {
    try {
        logger.info('Seeding RBAC permissions...');

        const permissionOps = PERMISSIONS.map((perm) => ({
            updateOne: {
                filter: { key: perm.key },
                update: { $set: perm },
                upsert: true,
            },
        }));
        await permissionModel.bulkWrite(permissionOps);
        logger.info(`Seeded ${PERMISSIONS.length} permissions`);

        for (const role of ['admin', 'core', 'chair', 'user']) {
            const existing = await roleConfigModel.findOne({ role });

            if (!existing) {
                await roleConfigModel.create({
                    role,
                    permissions: DEFAULT_ROLE_PERMISSIONS[role],
                });
                logger.info(`Created default RoleConfig for role: ${role}`);
            } else {
                const defaults = DEFAULT_ROLE_PERMISSIONS[role];
                const updates = {};
                let hasNewKeys = false;

                for (const key of Object.keys(defaults)) {
                    if (!existing.permissions.has(key)) {
                        updates[`permissions.${key}`] = defaults[key];
                        hasNewKeys = true;
                    }
                }

                if (hasNewKeys) {
                    await roleConfigModel.updateOne(
                        { role },
                        { $set: updates }
                    );
                    logger.info(`Added new permission keys to RoleConfig for role: ${role}`);
                }
            }
        }

        logger.info('RBAC seeding complete');
    } catch (err) {
        logger.error({ error: err }, 'RBAC seeding failed');
        throw err;
    }
};

export default seedRBAC;