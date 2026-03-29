import axios from 'axios';
import react, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from "../../config/apiConfig.js"
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermission.js';
import { useContext } from 'react';
import { AnalyticsPanel } from './AnalyticsPanel.jsx';
import DataProvider from '../../context/DataProvider.jsx';
import PDFPreview from "./PDFPreview.jsx"
import PDFReader from "./PDFReader.jsx"
import ShareDialog from "./ShareDialog.jsx"

const IndividualPaperPage = () =>{
    const {paper_id} = useParams();
    const [currentPaper, setCurrentPaper] = useState(null);
    const [similarPapers, setSimilarPapers] = useState([]);
    const navigate = useNavigate();
    const { hasPermission } = usePermissions();
    const { account } = useContext(DataProvider.DataContext);

    const isLoggedIn        = Boolean(account?._id);
    const canRead           = isLoggedIn && hasPermission('read_full_publication');
    const canShare          = isLoggedIn && hasPermission('share_publication_link');
    const canDownload       = isLoggedIn && hasPermission('download_publication');
    const canViewAnalytics  = isLoggedIn && hasPermission('view_publication_analytics');

    const [showPreview, setShowPreview] = useState(false);
    const [showReader, setShowReader]   = useState(false);
    const [showShare, setShowShare]     = useState(false);

    const shareUrl = `${window.location.origin}/research-paper/${paper_id}`;

    const handleRead  = () => setShowReader(true);
    const handleShare = () => setShowShare(true);


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
                // Fire view tracking silently — no auth required
                axiosInstance.post(`/api/documents/${paper_id}/track-view`).catch(() => {});
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
                        {/* ── Action Buttons ─────────────────────────────────────────── */}
<div className='pt-6 flex flex-col gap-3'>

    {/* Preview — visible to unregistered users only */}
{!isLoggedIn && (
    <button
        onClick={() => setShowPreview(true)}
        style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            padding: '10px 30px',
            borderRadius: 8,
            border: '0.5px solid #d9d9d9',
            background: 'transparent',
            color: '#000000',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: 'fit-content',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
        Preview Publication
    </button>
)}

    {/* Read */}
    {canRead ? (
        <button
            onClick={handleRead}
            style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                padding: '10px 30px',
                borderRadius: 8,
                border: 'none',
                background: '#004aad',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                width: 'fit-content',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#001e47'}
            onMouseLeave={e => e.currentTarget.style.background = '#004aad'}
        >
            Read Publication
        </button>
    ) : !isLoggedIn && (
        <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: '#d9d9d9',
            margin: 0,
            padding: '10px 0',
            borderBottom: '0.5px solid #d9d9d9',
        }}>
            <a href="/sign-in" style={{ color: '#004aad', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
            </a>
            {' '}to read the full publication.
        </p>
    )}

    {/* Share */}
    {canShare && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
                onClick={handleShare}
                style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '10px 30px',
                    borderRadius: 8,
                    border: '0.5px solid #d9d9d9',
                    background: 'transparent',
                    color: '#000000',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: 'fit-content',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = '#ffffff';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                Share Publication
            </button>
        </div>
    )}

    {/* Download */}
    {canDownload ? (
        <button
            onClick={PaperDownload}
            style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                padding: '10px 30px',
                borderRadius: 8,
                border: '0.5px solid #d9d9d9',
                background: 'transparent',
                color: '#000000',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: 'fit-content',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = '#ffffff';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
            }}
        >
            Download PDF
        </button>
    ) : isLoggedIn && (
        <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: '#000000',
            margin: 0,
            padding: '10px 0',
            borderBottom: '0.5px solid #d9d9d9',
        }}>
            A membership is required to download.{' '}
            <a href="/join-us/pricing" style={{ color: '#004aad', textDecoration: 'none', fontWeight: 600 }}>
                View plans →
            </a>
        </p>
    )}

</div>

                        {/* Analytics — visible to core and admin only */}
                        {canViewAnalytics && <AnalyticsPanel paperId={paper_id} />}

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
                                                            href={`/about/profile/${author._id}`}
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

            {/* ── PDF Preview Modal ───────────────────────────────────────── */}
{showPreview && (
    <div
        onClick={() => setShowPreview(false)}
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                background: '#000000',
                borderRadius: 25,
                border: '0.5px solid #d9d9d9',
                width: '100%',
                maxWidth: 720,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Modal header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 28px',
                borderBottom: '0.5px solid #d9d9d9',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 300,
                        color: '#d9d9d9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    }}>
                        Preview
                    </span>
                    <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#ffffff',
                    }}>
                        {currentPaper?.title}
                    </span>
                </div>
                <button
                    onClick={() => setShowPreview(false)}
                    style={{
                        background: 'transparent',
                        border: '0.5px solid #d9d9d9',
                        borderRadius: 8,
                        padding: '6px 14px',
                        color: '#d9d9d9',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#d9d9d9';
                    }}
                >
                    Close
                </button>
            </div>

            {/* PDF page — scrollable */}
            <div style={{
                overflowY: 'auto',
                flex: 1,
                minHeight: 0, // critical — allows flex child to shrink and scroll
                position: 'relative',
            }}>
                <PDFPreview paperId={paper_id} />

                {/* Fade overlay — sits above the PDF, fades at the bottom */}
                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 120,
                    background: 'linear-gradient(to bottom, transparent, #000000)',
                    pointerEvents: 'none',
                    marginTop: -120,
                }} />
            </div>

            {/* Modal footer CTA */}
            <div style={{
                padding: '20px 28px',
                borderTop: '0.5px solid #d9d9d9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
            }}>
                <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 300,
                    color: '#d9d9d9',
                }}>
                    Sign in to read the full publication
                </span>
                <a
                    href="/sign-in"
                    style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        padding: '8px 24px',
                        borderRadius: 8,
                        background: '#004aad',
                        color: '#ffffff',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#001e47'}
                    onMouseLeave={e => e.currentTarget.style.background = '#004aad'}
                >
                    Sign in →
                </a>
            </div>
        </div>
    </div>
)}

            {/* ── Read Publication Modal ───────────────────────────────────── */}
            {showReader && (
                <PDFReader
                    paperId={paper_id}
                    paperTitle={currentPaper?.title}
                    onClose={() => setShowReader(false)}
                />
            )}

            {/* ── Share Dialog ─────────────────────────────────────────────── */}
            {showShare && (
                <ShareDialog
                    url={shareUrl}
                    title={currentPaper?.title}
                    paperId={paper_id}
                    onClose={() => setShowShare(false)}
                />
            )}
        </>
    )
}

export default IndividualPaperPage;