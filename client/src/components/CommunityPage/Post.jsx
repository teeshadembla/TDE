import Comment from "../../components/CommunityPage/Comment.jsx";
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Send, ChevronDown, Eye, Clock, User, FileText, Image, Paperclip, Pencil, Trash2 } from 'lucide-react';
import axiosInstance from "../../config/apiConfig.js";

// Avatar Component
const Avatar = ({ name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold`}>
      {name}
    </div>
  );
};

// Time formatter
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
};



// File type detector
const getFileIcon = (url) => {
  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return <Image className="w-4 h-4" />;
  if (url.match(/\.(pdf)$/i)) return <FileText className="w-4 h-4" />;
  return <Paperclip className="w-4 h-4" />;
};

const Post = ({ post, comments = [], onToggleComments, showComments, onSubmitComment }) => {
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  useEffect(() => {
    // Check if user has liked this post (you'll need to implement this check)
    checkIfUserLiked();
  }, []);

  const checkIfUserLiked = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/checkLike`);
      const data = await response.json();
      setLiked(true);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axiosInstance.patch(`/api/community/${post._id}/like`);
      const data = await response.data;

      if (response.status===200) {
        setLiked(true);
        setLikeCount(data.likes);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onSubmitComment(post._id, newComment);
      setNewComment('');
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <Avatar name={post.author.avatar} size="md" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <span className="text-xs mr-64 text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(post.createdAt)}
              </span>
              {/* <span className="flex ml-96 justify-between">
                <Pencil onClick={handlePostUpdate} className="w-4 h-4 mr-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" />
                <Trash2 onClick={handlePostDelete} className="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" />
              </span> */}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-gray-700 cursor-pointer transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

        
            
            {/* File Attachment */}
            {post.file && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border hover:bg-gray-100 transition-colors cursor-pointer">
                {getFileIcon(post.file)}
                <span className="text-sm text-gray-600">View attachment</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all hover:bg-gray-100 ${liked ? 'text-red-600' : 'text-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            
            <button 
              onClick={() => onToggleComments(post._id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
          
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-sm">234 views</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          {/* Comment Form */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-3">
              <Avatar name="YU" size="sm" />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="text-black w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  rows="2"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;