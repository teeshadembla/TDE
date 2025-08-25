import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Send, ChevronDown, Eye, Clock, User, FileText, Image, Paperclip } from 'lucide-react';
import Post from '../../components/CommunityPage/Post.jsx';
import CreatePostModal from '../../components/CommunityPage/CreatePostModal';
import axiosInstance from '../../config/apiConfig.js';
import { useContext } from 'react';
import DataProvider from '../../context/DataProvider.jsx';
import {toast} from "react-toastify";
// Mock data for demonstration
const mockPosts = [
  {
    _id: '1',
    title: 'Welcome to our Community!',
    content: 'This is our new community platform where we can share ideas, ask questions, and help each other grow. Feel free to introduce yourself and share what brings you here.',
    author: { name: 'John Doe', avatar: 'JD' },
    file: 'https://example.com/welcome.pdf',
    createdAt: '2024-01-15T10:30:00Z',
    comments: 12,
    likes: 24
  },
  {
    _id: '2',
    title: 'Best Practices for Web Development',
    content: 'I wanted to share some insights I\'ve gathered over the years about web development best practices. Clean code, proper documentation, and testing are essential foundations for any successful project.',
    author: { name: 'Jane Smith', avatar: 'JS' },
    file: 'https://example.com/best-practices.jpg',
    createdAt: '2024-01-14T15:45:00Z',
    comments: 8,
    likes: 31
  }
];

const mockComments = {
  '1': [
    {
      _id: 'c1',
      content: 'Great initiative! Looking forward to being part of this community.',
      author: { name: 'Alice Johnson', avatar: 'AJ' },
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      _id: 'c2',
      content: 'Thanks for creating this space. Excited to learn and share!',
      author: { name: 'Bob Wilson', avatar: 'BW' },
      createdAt: '2024-01-15T11:30:00Z'
    }
  ],
  '2': [
    {
      _id: 'c3',
      content: 'Excellent points! Documentation is often overlooked but so important.',
      author: { name: 'Carol Davis', avatar: 'CD' },
      createdAt: '2024-01-14T16:00:00Z'
    }
  ]
};


// Main Community Page Component
const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState(mockComments);
  const [showComments, setShowComments] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [author, setAuthor] = useState();
  const {account} = useContext(DataProvider.DataContext);

  useEffect(()=>{
    setAuthor(account._id);
  },[account])

  /* Useeffect to find all the posts and list them */
  useEffect(()=>{
    const fetchAllPosts = async () =>{
      try{
        const result = await axiosInstance.get("/api/community/getAllPosts");
        setPosts(result.data.posts);
      }catch(err){
        console.error("Error fetching posts:", err);
        toast.error("Error fetching posts");
        setPosts([]);
      }
    }
    fetchAllPosts();
  },[])

  /* UseEffect to fetch all comments by postId */
  const fetchAllComments = async (postId) =>{
    try{
      const result = await axiosInstance.get(`/api/community/getAllComments/${postId}`);
      setComments(prev => ({
        ...prev,
        [postId]: result.data.comments
      }));
    }catch(err){
      console.log("This error occurred while fetching comments:", err);
      toast.error("Error fetching comments");
    }
  }



  const handleToggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/comment/deleteComment/${commentId}`);
      setComments(prev => {
        const updatedComments = { ...prev };
        for (const postId in updatedComments) {
          updatedComments[postId] = updatedComments[postId].filter(comment => comment._id !== commentId);
        }
        return updatedComments;
      });
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Error deleting comment");
    }
  };

  const handleCommentUpdate = async({commentId, content})=>{
    try{
      const result = await axiosInstance.put(`/api/comment/updateComment/${commentId}`, { content, author });
      const updatedComment = result.data.comment;
      setComments(prev => ({
        ...prev,
        [updatedComment.postId]: prev[updatedComment.postId].map(comment => comment._id === updatedComment._id ? updatedComment : comment)
      }));
      toast.success("Comment updated successfully");
    }catch(err){
      console.error("Error updating comment:", err);
      toast.error("Error updating comment");
    }
  }

  const handlePostDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/api/community/deletePost/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Error deleting post");
    }
  };

  const handlePostUpdate = async({postId, content})=>{
    try {
      const result = await axiosInstance.put(`/api/community/updatePost/${postId}`, { content, author });
      const updatedPost = result.data.post;
      setPosts(prev => prev.map(post => post._id === updatedPost._id ? updatedPost : post));
      toast.success("Post updated successfully");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Error updating post");
    }
  }

  const handleSubmitComment = async(postId, content) => {
    try{const result = await axiosInstance.post(`/api/comment/addComment`, { content, postId, author });
    const newComment = result.data.comment;

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    toast.success("Comment added successfully");
  }catch(err){
    console.error("Error adding comment:", err);
    toast.error(err.response?.data?.msg || "Error adding comment");
  }
    
  };

 const handleCreatePost = async (postData) => {
  try {
    const result = await axiosInstance.post('/api/community/createPost', {
      ...postData,
      author: account._id,
      createdAt: new Date().toISOString(),
      comments: 0,
      likes: 0
    });

    setPosts(prev => [result.data.post, ...prev]);
    toast.success("Post created successfully");
    
  } catch (err) {
    console.error("Error creating post:", err);
    toast.error("Error creating post");
  }
};


  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community</h1>
              <p className="text-sm text-gray-600">Share ideas and connect with others</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-black px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {posts.length} posts
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedPosts.map(post => (
            <Post
              key={post._id}
              post={post}
              comments={comments[post._id] || []}
              showComments={showComments[post._id]}
              onToggleComments={handleToggleComments}
              onSubmitComment={handleSubmitComment}
            />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create First Post
            </button>
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default CommunityPage;