import commentsController from "../Controllers/commentsController.js";
import express from "express";
import authenticateToken from "../Controllers/tokenControllers.js";

const commentRouter = express.Router();

commentRouter.post("/addComment", authenticateToken ,commentsController.addCommentOnPost);
commentRouter.patch("/updateComment/:commentId", authenticateToken,commentsController.updateCommentOnPost);
commentRouter.delete("/deleteComment/:commentId", authenticateToken, commentsController.deleteComment);

export default commentRouter;