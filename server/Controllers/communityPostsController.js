import communityPostsModel from "../Models/communityPostsModel.js";
import userModel from "../Models/userModel.js";
import communityPostValidationSchema from "../SchemaValidation/communityPostsValidation.js";
import logger from "../utils/logger.js";

const addNewPost = async(req, res) =>{
    try{

        const {title, content, author} = req.body;

        // Validate request body against the schema
        const { error } = communityPostValidationSchema.validate({ title, content, author });
        if (error) {
            logger.error({validationError: error.details, title, content, author}, "Post Addition Failed: Validation Error");
            return res.status(400).json({ msg: "Validation error", details: error.details });
        }
        const newPost = new communityPostsModel({title, content, author});
        await newPost.save();

        logger.debug({title, author}, "Post Addition Successful");

        return res.status(200).json({msg: "Post added successfully", post: newPost});
    }catch(err){
        logger.error({errorMsg: err.message, stack:err.stack}, "Post Addition Failed");
        return res.status(500).json({msg: "Internal Server Error", error: err});
    }
}

/* Callback to update post */
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, file } = req.body;

        // Validate request body against the schema
        const { error } = communityPostValidationSchema.validate({ title, content, author, file });
        if (error) {
            logger.error({validationError: error.details, id, title, content, author, file}, "Post Update failed: Validation Error");
            return res.status(400).json({ msg: "Validation error", details: error.details });
        }

        const updatedPost = await communityPostsModel.findByIdAndUpdate(id, { title, content, author, file }, { new: true });
        if (!updatedPost) {
            logger.warn({id, title, content, author, file}, "Post Update Failed: Post does not exist");
            return res.status(404).json({ msg: "Post not found" });
        }

        logger.info({id, title, author}, "Post Update Successful");

        return res.status(200).json({ msg: "Post updated successfully", post: updatedPost });
    } catch (err) {
        logger.error({postId: id, errorMsg: err.message, stack: err.stack}, "Post Update Failed");
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await communityPostsModel.findByIdAndDelete(id);
        if (!deletedPost) {
            logger.warn({postId: id}, "Post Deletion Failed: Post does not exist");
            return res.status(404).json({ msg: "Post not found" });
        }

        logger.debug({postId: id}, "Post Deletion Successful");

        return res.status(200).json({ msg: "Post deleted successfully", post: deletedPost });
    } catch (err) {
        logger.error({postId: id, errorMsg: err.message, stack: err.stack}, "Post Deletion Failed");
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await communityPostsModel.find().sort({ createdAt: -1 });

        logger.debug({resultantCount: posts.length}, "Fetched all posts successfully")
        return res.status(200).json({ msg: "Posts fetched successfully", posts });
    } catch (err) {
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching all posts");
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await communityPostsModel.findById(id);
        if (!post) {
            logger.warn({authorId: id}, "Getting post failed: Post does not exist");
            return res.status(404).json({ msg: "Post not found" });
        }

        logger.debug({postId: id}, "Fetched post successfully");
        return res.status(200).json({ msg: "Post fetched successfully", post });
    } catch (err) {
        logger.error({postId: id, errorMsg: err.message, stack: err.stack}, "Error fetching post by ID")
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const likePost = async(req, res)=>{
    try{
        const { postId } = req.params;
        const post = await communityPostsModel.findById(postId);

        if (!post) {
            logger.warn({postId}, "Liking Post Failed: Post does not exist");
            return res.status(404).json({ msg: "Post not found" });
        }

        post.likes += 1;
        await post.save();

        logger.debug({postId, totalLikes: post.likes}, "Post liked successfully");
        return res.status(200).json({ msg: "Post liked successfully", post });
    }catch(err){
        logger.error({postId, errorMsg: err.message, stack: err.stack}, "Error liking post");
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}
export default {addNewPost, updatePost, deletePost, getAllPosts, getPostById, likePost}