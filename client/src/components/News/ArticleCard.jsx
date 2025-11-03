// ArticleCard.jsx
import React from 'react';
import striptags from "striptags";


const ArticleCard = ({ article, onClick }) => {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer box-border text-[#333333] block font-sans text-[14px] leading-[20px] static w-[940px] h-[316px] [unicode-bidi:isolate]"
    >
      <div className="box-border text-[#333333] flex font-sans text-[14px] leading-[20px] mt-[40px] relative h-[280px]">
        {/* Image Section */}
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="box-border text-[#333333] block font-sans text-[14px] leading-[20px] h-[280px] w-[380px] object-cover align-middle overflow-clip"
          loading="lazy"
        />

        {/* Content Section */}
        <div className="box-border text-[#333333] flex flex-col flex-nowrap justify-center font-sans text-[14px] leading-[20px] h-[280px] w-[560px] px-[30px] py-0 isolate">
          <div className='flex items-center box-border text-[#333333] gap-x-2 gap-y-2 font-sans text-[14px] leading-[20px] h-[20px] w-[500px] isolate'>
            <div className='box-border text-[#9f9f9f] font-sans text-sm leading-5 isolate'>{article.publishingDate}</div>
          </div>
          <h4 className='box-border text-[#333333] block font-sans text-[18.2px] font-semibold leading-[21.84px] mt-[10px] mb-[10px] isolate'>{article.title}</h4>
          <div className='box-border text-[#6f6f6f] block font-sans text-[14px] leading-[20px] isolate w-[500px]'>
            {/* Excerpt */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              <p>{striptags(article.content).length > 200
                  ? striptags(article.content).substring(0, 200) + "..."
                  : striptags(article.content)}</p>
            </p>
          </div>

          {/* Category Badge */}
          <div className="box-border bg-[#eaeaec] border border-[#cccacb] rounded-[20px] text-[#6f6f6f] font-sans text-[12px] leading-[20px] mt-[20px] mb-[10px] p-[4px] text-center w-[144px]">
            
              {article.slug}
          </div>
        </div>
      </div>
      <div className='box-border bg-[#cccacb] text-[#333333] font-sans text-[14px] leading-[20px] h-[1px] mt-[35px] mb-[35px] w-[940px]'>

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