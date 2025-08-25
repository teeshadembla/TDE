import React, { useState } from 'react';
import { Play, X, Clock, Eye, Share, Copy, ChevronRight, ChevronLeft } from 'lucide-react';

const YouTubeVideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Sample video data - replace with your actual video data
  const videos = [
    {
      id: 'cU5RVz9D1h0',
      title: 'Nicole Sulu at Davos 2025 | The Digital Economist delegation',
      description: 'Each year, The Digital Economist brings the most innovative partner organizations and the most proactive leaders from its Executive Fellowship ecosystem to Davos, advocating for their work at the world\'s most influential gathering. The organization facilitates speaking engagements for its Executive Fellows and aligns strategic meetings with key stakeholders.',
      thumbnail: 'https://img.youtube.com/vi/cU5RVz9D1h0/maxresdefault.jpg',
      duration: '03:08',
      views: '1.2M',
      uploadDate: '2 days ago',
      channel: 'The Digital Economist'
    },
    {
      id: '-PICpMed_nE',
      title: 'Dr. Monica Lopez at Davos 2025 | The Digital Economist delegation',
      description: 'Dr. Monica Lopez is a global leader in AI ethics and emerging technologies, blending governance, policy, and innovation....',
      thumbnail: 'https://img.youtube.com/vi/-PICpMed_nE/maxresdefault.jpg',
      duration: '08:45',
      views: '856K',
      uploadDate: '3 days ago',
      channel: 'The Digital Economist'
    },
    {
      id: 'mHel43ZAjo4',
      title: 'Sandy Carter at Davos 2025 | The Digital Economist delegation',
      description: 'Sandy Carter is the Chief Operating Officer of Unstoppable Domains, creating Web3 domains with user-controlled data at its core. A...',
      thumbnail: 'https://img.youtube.com/vi/mHel43ZAjo4/maxresdefault.jpg',
      duration: '12:30',
      views: '2.1M',
      uploadDate: '1 week ago',
      channel: 'The Digital Economist'
    },
    {
      id: 'kFdIGNCqi8Q',
      title: 'Davos Agenda 2025 | Stewards of an Intelligent, Inclusive Future',
      description: 'Join us at the World Economic Forum Annual Meeting 2025 as global leaders discuss building an intelligent, inclusive future...',
      thumbnail: 'https://img.youtube.com/vi/kFdIGNCqi8Q/maxresdefault.jpg',
      duration: '45:20',
      views: '3.5M',
      uploadDate: '2 weeks ago',
      channel: 'The Digital Economist'
    },
    {
      id: 'Q0ymRpwGNhY',
      title: 'Tech Leaders Panel at Davos 2025',
      description: 'Leading technology executives discuss the future of digital transformation and its impact on global economics...',
      thumbnail: 'https://img.youtube.com/vi/Q0ymRpwGNhY/maxresdefault.jpg',
      duration: '28:15',
      views: '1.8M',
      uploadDate: '3 weeks ago',
      channel: 'The Digital Economist'
    },
    {
      id: 'jYU-sv0fgow',
      title: 'AI Ethics Summit Highlights',
      description: 'Key moments from the AI Ethics Summit featuring discussions on responsible AI development and governance...',
      thumbnail: 'https://img.youtube.com/vi/jYU-sv0fgow/maxresdefault.jpg',
      duration: '15:42',
      views: '945K',
      uploadDate: '1 month ago',
      channel: 'The Digital Economist'
    }
  ];

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const getRelatedVideos = (currentVideoId) => {
    return videos.filter(video => video.id !== currentVideoId);
  };

  if (selectedVideo) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-90">
          <div className="flex items-center space-x-2">
            <Share className="w-5 h-5 text-white" />
            <span className="text-white text-sm">Share</span>
          </div>
          <button
            onClick={closeVideo}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row p-4 space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Video Player Section */}
          <div className="lg:w-2/3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                className="w-full h-64 lg:h-96"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Details Section */}
          <div className="lg:w-1/3 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Copy className="w-4 h-4" />
              <span className="text-sm text-gray-300">Copy link</span>
            </div>
            
            <h1 className="text-xl font-bold mb-2">{selectedVideo.title}</h1>
            
            <div className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
              <span>{selectedVideo.channel}</span>
              <span>•</span>
              <span>{selectedVideo.duration}</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {selectedVideo.description}
            </p>
          </div>
        </div>

        {/* Related Videos */}
        <div className="p-4 bg-black bg-opacity-90">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">More videos</h3>
            <div className="flex space-x-2">
              <button className="text-white hover:text-gray-300 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {getRelatedVideos(selectedVideo.id).map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-48 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openVideo(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <h4 className="text-white text-sm font-medium mt-2 line-clamp-2">
                  {video.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-700 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Davos 2025 Videos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors group"
              onClick={() => openVideo(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{video.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.uploadDate}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoGrid;