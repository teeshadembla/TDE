// Create Post Modal Component
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Send, ChevronDown, Eye, Clock, User, FileText, Image, Paperclip } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title, content, file });
      setTitle('');
      setContent('');
      setFile(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Enter post title..."
              maxLength={50}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{title.length}/50 characters</div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-black w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              rows="6"
              placeholder="Share your thoughts..."
              maxLength={1500}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{content.length}/1500 characters</div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Post
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;