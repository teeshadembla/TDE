import communityPostsController from "../Controllers/communityPostsController.js";
import express from "express";
import authenticateToken from "../Controllers/tokenControllers.js";

const postRouter = express.Router();

postRouter.post("/createPost",authenticateToken,  communityPostsController.addNewPost);
postRouter.get("/getAllPosts", communityPostsController.getAllPosts);
postRouter.patch("/updatePost/:postId", authenticateToken,communityPostsController.updatePost);
postRouter.delete("/deletePost/:postId",authenticateToken, communityPostsController.deletePost);
postRouter.patch("/:postId/like", authenticateToken,communityPostsController.likePost);
export default postRouter;