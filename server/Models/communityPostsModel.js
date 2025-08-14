import mongoose    from "mongoose";

const communityPostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  file: { type: String, required: true }
});

const communityPostsModel = mongoose.model("CommunityPost", communityPostsSchema);

export default communityPostsModel;
