import express from 'express';
import userController from '../Controllers/userController.js';
import authenticateToken from '../Controllers/tokenControllers.js';
const userRouter = express.Router({mergeParams:true});

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.delete("/logout",authenticateToken, userController.logout);
userRouter.get("/me",authenticateToken, userController.getMe);

userRouter.get("/stats", authenticateToken, userController.getUserStats);

/* Get core team members */
userRouter.get("/core-team", authenticateToken, userController.getCoreTeamMembers);

/* Get fellow data */
userRouter.get("/fellows", authenticateToken, userController.getFellows);

/* Update and delete user profile */
userRouter.patch("/update/:id", authenticateToken, userController.updateUser);
userRouter.delete("/delete/:id", authenticateToken, userController.deleteUser);

userRouter.get("/:id", authenticateToken, userController.getUserById);  
export default userRouter;