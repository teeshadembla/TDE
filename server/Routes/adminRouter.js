import express from "express";
import {
    fetchNonVerifiedUsers,
    verifyUserByAdmin,
    rejectUserByAdmin,
    getPendingVerificationUsers
} from "../Controllers/adminController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";

const adminRouter = express.Router();

// All admin routes require authentication + the relevant permission.
// This means if an admin toggles off 'verify_users' for the 'core' role,
// core members will immediately lose access to these endpoints too.

adminRouter.get(
    "/non-verified-Users",
    authenticateToken,
    requirePermission('verify_users'),
    fetchNonVerifiedUsers
);

adminRouter.post(
    "/verify-user/:id",
    authenticateToken,
    requirePermission('verify_users'),
    verifyUserByAdmin
);

adminRouter.post(
    "/reject-user/:id",
    authenticateToken,
    requirePermission('verify_users'),
    rejectUserByAdmin
);

adminRouter.get(
    "/pending-users",
    authenticateToken,
    requirePermission('verify_users'),
    getPendingVerificationUsers
);

export default adminRouter;