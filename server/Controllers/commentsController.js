
import commentsModel from "../Models/commentsModel.js";
import logger from "../utils/logger.js";

const addCommentOnPost = async(req, res) =>{
    try{
        const {postId, author, content} = req.body;

        if(!author || !content || !postId){
            logger.warn({postId, author}, "Comment Failed: Missing required fields");

            return res.status(400).json({msg: "Invalid input data. Please provide postId, author, and content."});
        }

        const isAuthorExist = await userModel.findById(author);

        if(!isAuthorExist){

            logger.warn({author}, "Comment Failed: Author does not exist");
            res.status(404).json({msg: "Author does not exist. Please provide a valid author ID or login."});
        }

        const newComment = new commentsModel({ postId, author, content });
        await newComment.save();

        logger.info({postId, author}, "New comment added successfully");

        return res.status(200).json({ msg: "Comment added successfully", comment: newComment });
    }catch(err){
        
        logger.error({error: err, errorMsg: err.message, stack: err.stack}, "Comment Failed");
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const updateCommentOnPost = async(req, res) =>{
    try{
        const { commentId, content } = req.body;

        const updatedComment = await commentsModel.findByIdAndUpdate(commentId, { content }, { new: true });
        if (!updatedComment) {

            logger.warn({commentId, content}, "Update Failed: Comment does not exist")
            return res.status(404).json({ msg: "Comment not found" });
        }

        logger.info({commentId, content}, "Update Successful" );
        return res.status(200).json({ msg: "Comment updated successfully", comment: updatedComment });
    }catch(err){

        logger.error({commentId, errorMsg: err.message, stack: err.stack}, "Update Failed")
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const deleteComment = async(req, res) =>{
    try{        
        const {commentId} = req.body;

        const deletedComment = await commentsModel.findByIdAndDelete(commentId);
        if(!deletedComment){
            logger.warn({commentId, content}, "Delete Failed: Comment does not exist")
            return res.status(404).json({ msg: "Comment not found" });
        }

        logger.info({commentId},"Delete Successful")
        return res.status(200).json({ msg: "Comment deleted successfully" });

    }catch(err){
        logger.error({commentId, errorMsg: err.message, stack: err.stack}, "Delete Failed")
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const getAllCommentsByPost = async(req, res) =>{
    try{
        const {postId} = req.body;
        const comments = commentsModel.find({postId: postId});

        if(!comments){

            logger.warn({postId}, "Invalid PostId")
            return res.status(404).json({msg:"Invalid postId. Comments not found."});
        }

        logger.debug({postId, commentsCount: comments.length},"Comments found")
        return res.status(200).json({msg: "Comments successfully found", comments: comments});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching comments");
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const getAllCommentsByPostAndAuthor = async(req, res)=>{
    try{
        const {postId, author} = req.body;
        if(!postId || !author){
            logger.warn({postId, author}, "Invalid postId or author");
            return res.status(404).json({msg: "Invalid postId or author. Try again with valid details."});
        }

        const comments = await commentsModel.find({ postId, author });
        
        if (!comments) {
            logger.warn({postId, author}, "No comments found for this post and author");
            return res.status(404).json({msg: "No comments found for this post and author"});
        }


        logger.debug({postId, author, commentsCount: comments.length}, "Comments found successfully by author and post")
        return res.status(200).json({
            msg: "Comments found successfully",
            comments: comments
        });
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching comments by post and Author")
        return res.status(500).json({msg: "Internal Server Error", error: err});
    }
}

/* Controller to get comments by only author */

const getAllCommentsByAuthor = async(req, res) =>{
    try{
        const { author } = req.body;

        if (!author) {
            logger.warn({author}, "Comments not found: Invalid author");
            return res.status(404).json({msg: "Invalid author. Try again with valid details."});
        }

        const comments = await commentsModel.find({ author });

        if (!comments || comments.length === 0) {
            logger.warn({author}, "No comments found for this author");
            return res.status(404).json({msg: "No comments found for this author"});
        }

        logger.debug({author, commentsCount: comments.length}, "Comments found successfully by author");
        return res.status(200).json({
            msg: "Comments found successfully",
            comments: comments
        });
    }catch(err){

        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching comments by Author")
        return res.status(500).json({msg: "Internal Server Error", error: err});
    }
}

export default { addCommentOnPost, updateCommentOnPost, deleteComment, getAllCommentsByPost, getAllCommentsByPostAndAuthor, getAllCommentsByAuthor };