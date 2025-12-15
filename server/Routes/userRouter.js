import express from 'express';
import userController from '../Controllers/userController.js';
import authenticateToken from '../Controllers/tokenControllers.js';
import {getUsersByWorkgroup} from "../Controllers/workgroupController.js";
import { uploadProfilePicture } from '../utils/multerConfig.js';
const userRouter = express.Router({mergeParams:true});

userRouter.post("/signup", uploadProfilePicture.single('profilePicture') ,userController.signup);
userRouter.post("/login", userController.login);
userRouter.delete("/logout",authenticateToken, userController.logout);
userRouter.get("/me", userController.getMe);

userRouter.get("/stats", authenticateToken, userController.getUserStats);

/* Get core team members */
userRouter.get("/core-team", userController.getCoreTeamMembers);

/* Get fellow data */
userRouter.get("/fellows", userController.getFellows);

/* Update and delete user profile */
userRouter.patch("/update/:id", authenticateToken, userController.updateUser);
userRouter.delete("/delete/:id", authenticateToken, userController.deleteUser);

userRouter.get("/:id", userController.getUserById);  

/* Get fellows by workgroup */
userRouter.get("/workgroup/:workgroupId", getUsersByWorkgroup);

userRouter.post("/enabledMFA", authenticateToken, userController.enabledMFA);

userRouter.get("/get2FADetails/:id", authenticateToken, userController.getUserById);

userRouter.post("/forgot-password", userController.forgotPassword);

export default userRouter;