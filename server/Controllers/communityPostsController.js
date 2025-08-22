import communityPostsModel from "../Models/communityPostsModel.js";
import communityPostValidationSchema from "../SchemaValidation/communityPostsValidation.js";

const addNewPost = async(req, res) =>{
    try{

        const {title, content, author} = req.body;

        // Validate request body against the schema
        const { error } = communityPostValidationSchema.validate({ title, content, author });
        if (error) {
            return res.status(400).json({ msg: "Validation error", details: error.details });
        }
        const newPost = new communityPostsModel({title, content, author});
        await newPost.save();

        return res.status(200).json({msg: "Post added successfully", post: newPost});
    }catch(err){
        console.log("This error occurred while adding a new post:", err);
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
            return res.status(400).json({ msg: "Validation error", details: error.details });
        }

        const updatedPost = await communityPostsModel.findByIdAndUpdate(id, { title, content, author, file }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ msg: "Post not found" });
        }

        return res.status(200).json({ msg: "Post updated successfully", post: updatedPost });
    } catch (err) {
        console.log("This error occurred while updating a post:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

/* Callback to delete a post */
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await communityPostsModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ msg: "Post not found" });
        }

        return res.status(200).json({ msg: "Post deleted successfully", post: deletedPost });
    } catch (err) {
        console.log("This error occurred while deleting a post:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

/* Callback to fetch all posts latest  to first */
const getAllPosts = async (req, res) => {
    try {
        const posts = await communityPostsModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ msg: "Posts fetched successfully", posts });
    } catch (err) {
        console.log("This error occurred while fetching posts:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await communityPostsModel.findById(id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        return res.status(200).json({ msg: "Post fetched successfully", post });
    } catch (err) {
        console.log("This error occurred while fetching a post:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}

const likePost = async(req, res)=>{
    try{
        const { postId } = req.params;
        console.log("Finding post with ID:", postId);
        const post = await communityPostsModel.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        post.likes += 1;
        await post.save();

        return res.status(200).json({ msg: "Post liked successfully", post });
    }catch(err){
        console.log("This error occurred while liking a post:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err });
    }
}
export default {addNewPost, updatePost, deletePost, getAllPosts, getPostById, likePost}