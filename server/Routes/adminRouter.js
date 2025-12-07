import express from "express";
import { fetchNonVerifiedUsers , verifyUserByAdmin, rejectUserByAdmin, getPendingVerificationUsers} from "../Controllers/adminController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
const adminRouter = express.Router();

adminRouter.get("/non-verified-Users", authenticateToken ,fetchNonVerifiedUsers);
adminRouter.post("/verify-user/:id", authenticateToken , verifyUserByAdmin);
adminRouter.post("/reject-user/:id", authenticateToken , rejectUserByAdmin);
adminRouter.get("/pending-users", authenticateToken , getPendingVerificationUsers);
export default adminRouter;