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
            try {
                const res = await axiosInstance.get(`/api/documents/${paper_id}/similar`);
                setSimilarPapers(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching similar papers:", err);
                setSimilarPapers([]);
            }
        };
        fetchSimilarPapers();
    }, [paper_id]);
    
    useEffect(()=>{
        const fetchPaperById = async () =>{
            try{
                console.log("This is the paper for which details are being fetched--->", paper_id);
                const response = await axiosInstance.get(`/api/documents/getPaperById/${paper_id}`)
                console.log("This is the research paper data retrieved by ID--->", response);

                setCurrentPaper(response.data.data);
            }catch(err){    
                console.error("Error fetching paper:", err);
                setCurrentPaper(null);
            }
        }

        fetchPaperById();
    }, [paper_id])
    return(
        <>
            <section className='mt-8 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6 md:px-8 flex justify-center'>
                <div className='w-full max-w-6xl text-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12 auto-rows-max'>
                    <div className='flex justify-center sm:justify-start'>
                        <img
                            src={currentPaper?.thumbnailUrl}
                            alt="Paper Thumbnail"
                            loading="lazy"
                            className="w-full h-auto max-h-80 sm:max-h-96 md:max-h-full object-contain rounded-lg "
                        />
                    </div>

                    <div className='flex flex-col gap-4 sm:gap-5 md:gap-6 justify-start font-sans'>
                        {/* Document Type Badge */}
                        <div className='inline-flex w-fit px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-full'>
                            {currentPaper?.documentType}
                        </div>

                        {/* Title */}
                        <h2 className=' font-bold text-2xl sm:text-3xl md:text-4xl font-montserrat leading-tight text-gray-800'>
                            {currentPaper?.title}
                        </h2>

                        {/* Publishing Date */}
                        <div className='text-sm sm:text-base text-gray-600'>
                            {currentPaper?.publishingDate &&
                                new Date(currentPaper.publishingDate).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </div>

                        {/* Subtitle */}
                        <div className='text-sm sm:text-base text-gray-600'>
                            {currentPaper?.subtitle || 'Healing a Broken World Series'}
                        </div>

                        {/* Authors Section */}
                        <div className='flex flex-col gap-2 pt-2'>
                            <div className='text-sm sm:text-base font-sans font-medium text-gray-700'>Authors:</div>
                            <div className='flex flex-col gap-1'>
                                {currentPaper?.Authors?.map((author, index) => (
                                    <a
                                        key={index}
                                        href={`/about/profile/${author._id}`}
                                        className='text-blue-600 hover:underline text-sm sm:text-base'
                                    >
                                        {author.FullName}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className='pt-2 md:pt-4'>
                            <p className='text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed'>
                                {currentPaper?.description || ''}
                            </p>
                        </div>

                        {/* Download Button */}
                        <div className='pt-4 md:pt-6'>
                            <button
                                onClick={() => PaperDownload()}
                                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Similar Papers Section */}
            <div className="bg-gray-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 flex justify-center">
                <div className='w-full max-w-6xl'>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 md:mb-12">
                        Similar Publications
                    </h2>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10'>
                        {similarPapers && similarPapers?.length > 0 ? (
                            similarPapers?.map((paper) => (
                                <a key={paper._id} href={`/research-paper/${paper._id}`} className='block group'>
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full p-4 sm:p-6 flex flex-col gap-4">
                                        {/* Thumbnail */}
                                        <div className='w-full flex justify-center'>
                                            <img
                                                src={paper?.thumbnailUrl}
                                                alt={paper?.title}
                                                className='w-28 h-36 sm:w-32 sm:h-40 md:w-40 md:h-52 object-cover rounded shadow-sm'
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className='flex flex-col gap-3 flex-1'>
                                            {/* Document Type */}
                                            <div className='inline-flex w-fit px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full'>
                                                {paper?.documentType}
                                            </div>

                                            {/* Title */}
                                            <h4 className="font-dm-sans font-semibold text-base sm:text-lg md:text-xl leading-tight text-gray-800 group-hover:text-blue-700 transition-colors">
                                                {paper.title}
                                            </h4>

                                            {/* Authors */}
                                            <div className='flex flex-col gap-1 text-xs sm:text-sm'>
                                                <div className='font-medium text-gray-700'>Authors:</div>
                                                <div className='flex flex-col gap-0.5'>
                                                    {paper?.Authors?.map((author, index) => (
                                                        <a
                                                            key={index}
                                                            href={`/profile/${author._id}`}
                                                            className='text-blue-600 hover:underline'
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {author.FullName}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className='text-xs sm:text-sm text-gray-600 pt-2 mt-auto'>
                                                {new Date(paper?.publishingDate).toLocaleDateString("en-US", {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className='col-span-1 sm:col-span-2 text-center text-gray-600 py-12'>
                                No similar papers found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default IndividualPaperPage;