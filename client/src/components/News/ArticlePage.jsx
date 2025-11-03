import react, { useEffect, useState } from 'react';
import NewsContent from '../../assets/Data';
import { useParams } from 'react-router';

const ArticlePage = () =>{
    const [articles, setArticles] = useState(NewsContent);
    const [article, setArticle] = useState({});
    const articleId = useParams();

    useEffect(()=>{
        const fetchArticleById = async () =>{
            console.log(articleId);
            console.log(articles);
            if (!articles || articles.length === 0) return;
            //const response = await articleModel.find({articleId});
            //setArticle(response);
            setArticle(articles.find(article => String(article.id) === String(articleId.articleId)));
            console.log("This is the current article --->", article);
        }

        fetchArticleById();
    },[articleId]);

    return(
        <section className='flex justify-center box-border text-[#333333] text-[14px] leading-[20px] font-sans w-full'>
            <div className='flex flex-col items-center text-[14px] leading-[20px] text-[#6f6f6f] max-w-[940px] mx-[195px] mb-[100px] box-border font-sans justify-center '>
                <div className='flex flex-col items-center box-border text-[#6f6f6f] text-[14px] leading-[20px] font-sans w-[940px] h-[726px] mt-[60px] gap-[21px]'>
                    <div className='w-[144px] text-center text-[12px] leading-[20px] text-[#6f6f6f] font-sans bg-[#eaeaec] border border-[#cccacb] rounded-[20px] p-[4px] mt-[20px] mb-[10px] box-border'>
                        {article.slug}
                    </div>
                    <h1 className='box-border text-[#161616] font-montserrat font-bold text-[37.8px] leading-[41.58px] text-center mt-[20px] mb-[10px] w-[940px]'>
                        {article.title}
                    </h1>
                    <div className='flex items-center justify-center box-border text-[rgb(111,111,111)] gap-x-[55px] gap-y-[55px] font-sans text-[14px] leading-[20px] h-[40px] w-[312px]'>
                        <div className='box-border text-[rgb(111,111,111)] block font-sans text-[14px] leading-[20px] h-[40px] w-[170px]
                        '>
                          <div className='flex items-center box-border text-[rgb(111,111,111)] font-sans text-[14px] leading-[20px] h-[40px] w-[170.86px] gap-[12px]
'>
                                <div className='flex items-center justify-center relative w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-[#f3f5fb] text-[#6f6f6f] text-[14px] leading-[20px] rounded-[100px] overflow-hidden box-border font-sans'>
                                    <img className='flex items-center justify-center bg-[#f3f5fb] text-[#6f6f6f] text-[14px] h-[40px] w-[40px] min-h-[40px] min-w-[40px] rounded-[100px] overflow-hidden relative box-border
                                    ' src={article.logoOfAuthor}>
                                    </img>
                                </div>
                                <p className='text-[14px] text-[#161616] font-dm-sans font-[400] leading-[18.2px] box-border
                                '>{article.Author}</p>
                            </div>  
                        </div>
                        <p className='text-[14px] flex justify-center items-center text-[#888888] font-sans font-[400] leading-[18.2px] box-border w-[86.5125px] h-[40px]
                        '>{article.publishingDate}
                    </p>
                    </div>
                
                    <img src={article.thumbnailUrl} className='aspect-[16/9] mt-[30px] mb-[30px] text-[14px] leading-[20px] text-[#6f6f6f] w-[695px] object-cover align-middle box-border'></img>
                </div>
                <div className='class="box-border w-[695px] text-[#161616] block font-inter text-[14px] font-normal leading-[20px] mt-[60px]"
                ' dangerouslySetInnerHTML={{ __html: article.content }}>
                </div>
            </div>
        </section>
    )
}

export default ArticlePage;