import communityPostsController from "../Controllers/communityPostsController.js";
import express from "express";

const postRouter = express.Router();

postRouter.post("/createPost", communityPostsController.addNewPost);
postRouter.get("/getAllPosts", communityPostsController.getAllPosts);
postRouter.patch("/updatePost/:postId", communityPostsController.updatePost);
postRouter.delete("/deletePost/:postId", communityPostsController.deletePost);
postRouter.patch("/:postId/like", communityPostsController.likePost);
export default postRouter;