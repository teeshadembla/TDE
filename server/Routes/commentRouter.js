import commentsController from "../Controllers/commentsController.js";
import express from "express";

const commentRouter = express.Router();

commentRouter.post("/addComment", commentsController.addCommentOnPost);
commentRouter.patch("/updateComment/:commentId", commentsController.updateCommentOnPost);
commentRouter.delete("/deleteComment/:commentId", commentsController.deleteComment);

export default commentRouter;