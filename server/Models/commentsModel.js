import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const commentsModel = mongoose.model("Comment", commentsSchema);

export default commentsModel;
