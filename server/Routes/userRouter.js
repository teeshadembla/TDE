import express from 'express';
import userController from '../Controllers/userController.js';
import {personalizedData, workgroupPick} from "../Controllers/personalizedDataController.js"; 
import authenticateToken from '../Controllers/tokenControllers.js';
import {getUsersByWorkgroup} from "../Controllers/workgroupController.js";
import { uploadProfilePicture } from '../utils/multerConfig.js';
import { uploadLimiter , authLimiter} from '../utils/Production/rateLimiter.js';
import requirePermission from '../middleware/requirePermission.js';
const userRouter = express.Router({mergeParams:true});

userRouter.post("/signup",uploadLimiter, uploadProfilePicture.single('profilePicture') ,userController.signup);
userRouter.post("/login", authLimiter ,userController.login);
userRouter.delete("/logout", authLimiter,authenticateToken, userController.logout);
userRouter.get("/me",authenticateToken, userController.getMe);

userRouter.get("/stats", authenticateToken, userController.getUserStats);

/* Get core team members */
userRouter.get("/core-team", userController.getCoreTeamMembers);


/* Update and delete user profile */
userRouter.patch("/update/:id", authenticateToken,requirePermission("access_profile_settings"), userController.updateUser);
userRouter.delete("/delete/:id", authenticateToken,requirePermission("access_profile_settings"), userController.deleteUser);

userRouter.get("/:id", userController.getUserById);  

/* Get fellows by workgroup */
userRouter.get("/workgroup/:workgroupId", getUsersByWorkgroup);

userRouter.post("/enabledMFA", authenticateToken,requirePermission("access_profile_settings"), userController.enabledMFA);

userRouter.get("/get2FADetails/:id", authenticateToken, userController.getUserById);

userRouter.post("/forgot-password", authenticateToken,requirePermission("access_profile_settings"), userController.forgotPassword);

/* Getting personalized highlights for new login environment */
userRouter.get("/highlights/personalized", authenticateToken, personalizedData);
userRouter.get("/highlights/workgroup", authenticateToken, workgroupPick);

export default userRouter;