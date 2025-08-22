import mongoose from "mongoose";

const communityPostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: String },
  likes: { type: Number, default: 0 }, 
  views: { type: Number, default: 0 }, 
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const communityPostsModel = mongoose.model("CommunityPost", communityPostsSchema);

export default communityPostsModel;
