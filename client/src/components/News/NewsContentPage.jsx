// NewsPage.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // or your router
import ArticleCard from './ArticleCard';
import NewsContent from "../../assets/Data.js";


const NewsContentPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  

  const handleArticleClick = (article) => {
    // Navigate to article detail page
    navigate(`/news/${article.id}`);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex justify-center items-center">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Articles List */}
        <div className="box-border text-[rgb(51,51,51)] block font-sans text-[14px] leading-[20px] w-[940px] h-auto">
          <div className='box-border block font-sans text-[#333] text-sm leading-5 w-[940px] h-[1028px]'>
          {loading && page === 1 ? (
            // Initial Loading Skeletons
            <>
              {NewsContent.map((article, index)=>(
                
                <ArticleCard article={article} onClick={()=>handleArticleClick(article)}/>
                
              ))}
            </>
          ) : articles.length > 0 ? (
            // Articles
            articles.map((article) => (
              <ArticleCard
                key={article._id || article.id}
                article={article}
                onClick={() => handleArticleClick(article)}
              />
            ))
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="mb-4">
                <svg 
                  className="w-24 h-24 mx-auto text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                  />
                </svg>
              </div>
              <p className="text-xl text-gray-500 mb-2">No articles found</p>
              <p className="text-sm text-gray-400">Check back soon for new content</p>
            </div>
          )}
          </div>
          {/* Loading More Indicator */}
          {loadingMore && (
            <>
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
            </>
          )}
        </div>

        {/* Load More Button */}
        {!loading && articles.length > 0 && hasMore && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#004AAD] text-white font-semibold rounded-lg hover:bg-[#003380] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More Articles
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* End Message */}
        {!loading && articles.length > 0 && !hasMore && (
          <div className="mt-16 text-center">
            <p className="text-gray-500">You've reached the end of the articles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsContentPage;