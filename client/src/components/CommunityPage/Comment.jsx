// Comment Component
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Send, ChevronDown, Eye, Clock, User, FileText, Image, Paperclip } from 'lucide-react';

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


const Comment = ({ comment }) => {
  return (
    <div className="flex gap-3 p-4 border-l-2 border-gray-200 ml-4 hover:bg-gray-50 transition-colors">
      <Avatar name={comment.author.avatar} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{comment.author.name}</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;