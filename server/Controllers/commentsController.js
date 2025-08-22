
import commentsModel from "../Models/commentsModel.js";

const addCommentOnPost = async(req, res) =>{
    try{
        const {postId, author, content} = req.body;

        const newComment = new commentsModel({ postId, author, content });
        await newComment.save();

        return res.status(200).json({ msg: "Comment added successfully", comment: newComment });
    }catch(err){
        console.log("This error occurred occurred while adding a comment--->", err);
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const updateCommentOnPost = async(req, res) =>{
    try{
        const { commentId, content } = req.body;

        const updatedComment = await commentsModel.findByIdAndUpdate(commentId, { content }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        return res.status(200).json({ msg: "Comment updated successfully", comment: updatedComment });
    }catch(err){
        console.log("This error occurred occurred while updating a comment--->", err);
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const deleteComment = async(req, res) =>{
    try{        
        const {commentId} = req.body;

        const deletedComment = await commentsModel.findByIdAndDelete(commentId);
        if(!deletedComment){
            console.log("Comment not found");
            return res.status(404).json({ msg: "Comment not found" });
        }

        return res.status(200).json({ msg: "Comment deleted successfully" });

    }catch(err){
        console.log("This error occurred occurred while deleting a comment--->", err);
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const getAllCommentsByPost = async(req, res) =>{
    try{
        const {postId} = req.body;
        const comments = commentsModel.find({postId: postId});

        if(!comments){
            return res.status(404).json({msg:"Invalid postId. Comments not found."});
        }

        return res.status(200).json({msg: "Comments successfully found", comments: comments});
    }catch(err){
        console.log("This error occurred occurred while fetching comments--->", err);
        return res.status(500).json({msg:"Internal Server Error", error: err});
    }
}

const getAllCommentsByPostAndAuthor = async(req, res)=>{
    try{
        const {postId, author} = req.body;
        if(!postId || !author){
            return res.status(404).json({msg: "Invalid postId or author. Try again with valid details."});
        }

        const comments = await commentsModel.find({ postId, author });
        
        if (!comments || comments.length === 0) {
            return res.status(404).json({msg: "No comments found for this post and author"});
        }

        return res.status(200).json({
            msg: "Comments found successfully",
            comments: comments
        });
    }catch(err){
        console.log("This error occurred in the backend callback when trying to get all comments by a certain post and author--->", err);
        return res.status(500).json({msg: "Internal Server Error", error: err});
    }
}

/* Controller to get comments by only author */

const getAllCommentsByAuthor = async(req, res) =>{
    try{
        const { author } = req.body;

        if (!author) {
            return res.status(404).json({msg: "Invalid author. Try again with valid details."});
        }

        const comments = await commentsModel.find({ author });

        if (!comments || comments.length === 0) {
            return res.status(404).json({msg: "No comments found for this author"});
        }

        return res.status(200).json({
            msg: "Comments found successfully",
            comments: comments
        });
    }catch(err){
        console.log("This error occurred in the backend callback when trying to get all comments by a certain author--->", err);
        return res.status(500).json({msg: "Internal Server Error", error: err});
    }
}

export default { addCommentOnPost, updateCommentOnPost, deleteComment, getAllCommentsByPost, getAllCommentsByPostAndAuthor, getAllCommentsByAuthor };