import express from 'express';
import userController from '../Controllers/userController.js';
import authenticateToken from '../Controllers/tokenControllers.js';
const userRouter = express.Router({mergeParams: true});

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.delete("/logout",authenticateToken, userController.logout);
userRouter.get("/me",authenticateToken, userController.getMe);

export default userRouter;