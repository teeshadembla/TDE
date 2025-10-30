// ArticleCard.jsx
import React from 'react';

const ArticleCard = ({ article, onClick }) => {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-gray-300 hover:border-[#004AAD] transition-colors duration-300">
        {/* Image Section */}
        <div className="w-full sm:w-[390px] flex-shrink-0">
          <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-gray-200">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Date */}
            <time className="text-gray-500 text-sm sm:text-base mb-3 block">
              {article.date}
            </time>

            {/* Title */}
            <h2 className="text-gray-900 text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight mb-4 group-hover:text-[#004AAD] transition-colors duration-300">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              {article.excerpt}
            </p>
          </div>

          {/* Category Badge */}
          <div className="flex items-center">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full border border-gray-300 group-hover:border-[#004AAD] group-hover:bg-[#004AAD] group-hover:text-white transition-all duration-300">
              {article.category}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

// ArticleCardSkeleton.jsx - Loading state component
export const ArticleCardSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-gray-300 animate-pulse">
      <div className="w-full sm:w-[390px] flex-shrink-0">
        <div className="aspect-[4/3] bg-gray-300 rounded-lg"></div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded-full w-40"></div>
      </div>
    </div>
  );
};