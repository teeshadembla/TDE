import axios from 'axios';
import react, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const IndividualPaperPage = () =>{
    const {paper_id} = useParams();
    const [currentPaper, setCurrentPaper] = useState(null);
    const [similarPapers, setSimilarPapers] = useState([]);
    const navigate = useNavigate();

    const PaperDownload = async () =>{
        try{
            const response = await axiosInstance.get(`/api/documents/${paper_id}/download-url`);
            console.log("This is the download URL response--->", response.data.data.url);
            
            window.open(response.data.data.url, '_blank');

        }catch(err){
            console.log("This error occurred while trying to download the research paper PDF--->", err);
        }
    }

    useEffect(() => {
        const fetchSimilarPapers = async () => {
            const res = await axiosInstance.get(`/api/documents/${paper_id}/similar`);
            setSimilarPapers(res.data);
        };
        fetchSimilarPapers();
    }, [paper_id]);
    
    useEffect(()=>{
        const fetchPaperById = async () =>{
            try{
                const response = await axiosInstance.get(`/api/documents/getPaperById/${paper_id}`)
                console.log("This is the research paper data retrieved by ID--->", response.data.data);

                setCurrentPaper(response.data.data);
            }catch(err){    
                console.log("This error occurred while trying to ")
            }
        }

        fetchPaperById();
    }, [])
    return(
        <>
            <section id='section-2' className='mt-[100px] mb-[80px] w-[1330.4px] h-[770.275px]'>
                <div className='mx-[195.2px] w-[940px] h-[770.275px] text-[#333] grid grid-cols-2 grid-rows-[718.275px_0] auto-cols-[1fr] gap-x-[52px] grid-flow-row leading-[24px]'>
                    <img
                    src={currentPaper?.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-normal rounded-none col-start-1 col-end-2 row-start-1 row-end-2"
                    />

                    <div className='flex flex-col flex-nowrap text-[rgb(51,51,51)] font-sans text-[14px] leading-[20px] gap-y-[17px] gap-x-[17px] box-border w-[444px] h-[718.275px]'>
                        <div className='block box-border cursor-pointer text-[rgb(111,111,111)] bg-[rgb(234,234,236)] text-center text-[14px] font-sans font-normal leading-[20px] w-[140px] h-[38px] px-[15px] py-[9px] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] border-t-0 border-b-0 border-l-0 border-r-0 text-decoration-none'>
                            {currentPaper?.documentType}
                        </div>
                        <h2 className='box-border block font-dm-sans font-bold text-[32.2px] leading-[38.64px] text-[#333333] w-[444px] mt-[20px] mb-[10px]'>
                            {currentPaper?.fileName}
                        </h2>
                        <div className='box-border block text-[18px] leading-[20px] text-[#6f6f6f] font-sans w-[444px]'>
                            {new Date(currentPaper?.publishingDate).toLocaleDateString()}
                        </div>
                        <div className='box-border block font-sans text-[18px] leading-[20px] text-[#6f6f6f] w-[444px]'>
                            {currentPaper?.subtitle || 'Healing a Broken World Series'}
                        </div>
                        <div className='box-border flex font-sans text-[18px] leading-[20px] text-[#333333] w-[444px] h-[100px]'>
                            <div className='box-border block font-sans text-[18px] leading-[20px] text-[#6f6f6f] mr-[30px] w-[45.15px]'>
                                Authors:
                            </div>
                            <div className='box-border flex flex-col font-sans font-medium text-[18px] leading-[20px] text-[#333333] w-[182.962px]'>
                                {currentPaper?.Authors?.map((author, index) => (
                                    <span key={index} className='mr-2'><a href={`/profile/${author._id}`} className='hover:underline'>{author.FullName}</a></span>
                                ))}
                            </div>
                        </div>

                        <div className='box-border block font-sans text-[14px] leading-[20px] text-[#333333] w-[444px] h-[283px]'>
                                <p className='box-border block font-sans text-[14px] font-normal leading-[18.2px] text-[#888888] h-[273px] mb-[10px]'>
                                    {currentPaper?.description || ''}
                                </p>
                        </div>
                        <button onClick={() => PaperDownload()} className="bg-[#004aad] text-white mt-20
                         font-sans text-sm font-semibold leading-5 py-[14px] px-[21px] rounded-[4px] text-center cursor-pointer relative w-[222px]">
                                Download PDF
                        </button>
                    </div>

                    

                </div>
            </section>

            {/* Similar Papers */}
            <div className="bg-[#f0f1f1] box-border text-[#333333] block font-sans text-[14px] h-[457.15px] leading-[20px] pb-[50px] [text-size-adjust:100%] [unicode-bidi:isolate]">
                <div className='box-border text-[#333333] block font-sans text-[14px] leading-[20px] ml-[195.2px] mr-[195.2px] max-w-[940px] pt-[40px] [text-size-adjust:100%] [unicode-bidi:isolate] h-[407.15px] w-[940px]'>
                    <h2 className="box-border text-[#333333] block font-sans text-[32.2px] font-bold leading-[38.64px] h-[68.6375px] mb-[10px] mt-[20px] mr-0 ml-0 pt-[20px] pb-[30px] text-center w-[940px] [text-size-adjust:100%] [unicode-bidi:isolate]">Similar Publications</h2>
                    <div className="box-border text-[#333333] block font-sans text-[14px] leading-[20px] h-[268.513px] [text-size-adjust:100%] [unicode-bidi:isolate]">
                        <div className='box-border text-[#333333] grid font-sans text-[14px] leading-[20px] h-[268.513px] w-[940px] grid-cols-[462px_462px] grid-rows-[268.513px] gap-x-[16px] gap-y-[16px] [text-size-adjust:100%] [unicode-bidi:isolate]'>
                            {similarPapers?.map((paper) => (
                                <a href={`/research-paper/${paper._id}`}>
                                <div key={paper._id} className="bg-[#dbdbdc] box-border text-[#333333] flex font-sans text-[14px] leading-[20px] h-[268.513px] w-[462px] p-[25px] rounded-[8px] relative [text-size-adjust:100%] [unicode-bidi:isolate]">
                                    
                                    <img src={paper?.thumbnailUrl} className='box-border text-[#333333] block font-sans text-[14px] leading-[20px] h-[192px] w-[133px] align-middle overflow-clip [text-size-adjust:100%] [overflow-clip-margin:content-box]'></img>
                                    
                                    <div className='box-border block w-[259px] h-[218.512px] align-middle overflow-clip text-[#333] text-[14px] pl-[20px] leading-[20px] font-sans'>
                                        <div className='bg-[#EAEAEC] text-[#6F6F6F] font-sans text-[16px] font-normal rounded-[20px] text-center cursor-pointer px-[15px] py-[9px] w-[140px] h-[38px] leading-[20px]'>{paper?.documentType}</div>
                                        <h4 className="block text-[#333333] font-dm-sans font-semibold text-[18.5px] leading-[21.84px] w-[259px] mt-[10px] mb-[10px]">{paper.title}</h4>
                                        <div className='flex items-start justify-start text-[#333333] text-[14px] leading-[20px] gap-[6px] w-[259px] box-border font-sans'>
                                            <div className='box-border text-[#6f6f6f] block font-sans text-[18px] leading-[20px] w-[45.15px]'>Authors:</div>
                                            <div className='box-border text-[#333333] block font-sans text-[18px] leading-[20px] w-[123.412px] h-auto ml-5'>
                                                <div className='flex flex-col flex-nowrap items-start justify-center box-border text-[#333333] font-sans text-[18px] leading-[20px] w-[123.412px] h-auto'>
                                                    {paper?.Authors?.map((author, index) => (
                                                        <div key={index} className='box-border text-[#333333] block font-sans text-[18px] leading-[20px] w-[123.412px] h-[20px]'><a href={`/profile/${author._id}`} className='hover:underline'>{author.FullName}</a></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='box-border text-[#6f6f6f] block font-sans text-[18px] leading-[20px] w-[259px] mt-2'>
                                                {new Date(paper?.publishingDate).toLocaleDateString("en-US", {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                        </div>
                                    </div>

                                    


                                    {/* <div className="flex flex-wrap gap-2">
                                    {paper.tags.map((tag, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-[#2a2a2a] text-gray-400 rounded-md">
                                        {tag}
                                        </span>
                                    ))}
                                    </div> */}
                                </div>
                                </a>
                            ))}
                            
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default IndividualPaperPage;