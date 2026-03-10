import React, { useEffect, useState } from 'react';
import ResearchItem from './ResearchItem.jsx';
import axiosInstance from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';
import { ArrowBigDown } from 'lucide-react';

const ResearchDisplay = () => {
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [selectedWorkgroup, setSelectedWorkgroup] = useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const documentTypes = [
        { id: 'Report', name: 'Report' },
        { id: 'Opinion Piece', name: 'Opinion Piece' },
        { id: 'Policy Paper', name: 'Policy Paper' },
        { id: 'Position Paper', name: 'Position Paper' },
        { id: 'Industry Insight', name: 'Industry Insight' },
        { id: 'Research Article', name: 'Research Article' },
    ];

    useEffect(()=>{
        const fetchWorkgroups = async() =>{
            const response = await axiosInstance.get("api/fellowship/getWorkgroups");
            console.log(Array.isArray(response.data.data));
            setWorkgroups(response.data.data);
        }
        fetchWorkgroups();
    },[])

    useEffect(() => {
    const fetchPapers = async() => {
        try {
            const response = await axiosInstance.get("api/documents/getPapers");
            
            // Handle different possible response structures
            const paperData = response.data?.data || response.data?.papers || response.data || [];
            
            
            // Ensure it's an array before setting state
            if (Array.isArray(paperData)) {
                setPapers(paperData);
                setFilteredPapers(paperData);
            } else {
                console.error("Papers data is not an array:", paperData);
                setPapers([]);
                setFilteredPapers([]);
            }
        
        } catch(err) {
            setPapers([]);
            setFilteredPapers([]);
        }
    }

    fetchPapers();
}, []);

    // Apply filters whenever selection changes
    useEffect(() => {
        if (!Array.isArray(papers)) {
            setFilteredPapers([]);
            return;
        }

        let filtered = [...papers];
        console.log("This is the selexted workgroup-->",selectedWorkgroup);
        

        if (selectedWorkgroup) {
            filtered = filtered.filter(paper => String(paper.workgroupId) === String(selectedWorkgroup));
        }

        if (selectedDocType) {
            filtered = filtered.filter(paper => paper.documentType === selectedDocType);
        }

        setFilteredPapers(filtered);
    }, [selectedWorkgroup, selectedDocType, papers]);

    const handleWorkgroupChange = (e) => {
        setSelectedWorkgroup(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleDocTypeChange = (e) => {
        setSelectedDocType(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPapers = filteredPapers.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div id='publication-list' className='bg-[#000] p-0 flex jutsify-center w-full items-center'>
            <div id='publication-list wrapper' className='w-full max-w-[1092px] flex flex-col justify-center items-center gap-x-16 gap-y-16 mx-auto px-0 p-0 relative'>
                <div id='publication-list-top' className='flex flex-col justify-between items-start gap-x-[40px] gap-y-[40px] w-[1200px]'>
                    <h4 className='text-white font-sans text-[32px] my-10 font-semibold'>All Publications</h4>
                    <div className='flex justify-end items-stretch w-full gap-x-4 gap-y-4 pl-4'>
                        <div id='filter-workgroup' className='flex flex-col gap-x-1 gap-y-1 border-[0.8px] border-black'>
                            <select
                                value={selectedWorkgroup}
                                onChange={handleWorkgroupChange}
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                className='bg-[rgb(26,28,31)] border pl-[14.7px] text-[15px] pr[10px] py-[10px] border-black rounded-[8px] h-[41.6px] w-[211.6px] text-[rgb(118,118,118)]'
                            >
                                <option value=''>All Workgroups</option>
                                {Array.isArray(workgroups) && workgroups?.map((wg) => (
                                    <option key={wg._id} value={wg._id}>
                                        {wg.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div id='filter-doctype' className='flex flex-col gap-x-1 gap-y-1'>
                            <select
                                value={selectedDocType}
                                onChange={handleDocTypeChange}
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                className='bg-[rgb(26,28,31)] h-[41.6px] w-[211.6px] rounded-[8px] text-[15px] border-black text-[rgb(118,118,118)] font-medium pl-[14.7px] pr-[10px] py-[10px] focus:outline-none'
                            >
                                <option value=''>All Document Types</option>
                                {documentTypes?.map((docType) => (
                                    <option key={docType.id} value={docType.id}>
                                        {docType.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div id='publication-list-bottom' className='flex flex-col justify-center gap-y-6'>
                    <div id='w-dyn-list' className='w-[1200px] min-h-[1249.8px]'>
                        <div id='list' className='grid gap-x-4 gap-y-4 grid-rows-[auto_auto] grid-cols-2 auto-cols-fr'>
                            {paginatedPapers?.map((paper) => (
                                <div className='cursor-pointer align-middle' onClick={() => navigate(`/research-paper/${paper._id}`)} key={paper._id}>
                                    <ResearchItem paper={paper}/>
                                </div>
                            ))}
                        </div>
                        {paginatedPapers?.length === 0 && (
                            <div className='text-white text-center py-8'>
                                No papers found matching the selected filters.
                            </div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className='flex justify-center items-center gap-x-4 mt-8'>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className='px-6 py-2 bg-[#105ABD] text-white rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0d4a94] transition-colors'
                            >
                                Previous
                            </button>
                            <span className='text-white font-medium'>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className='px-6 py-2 bg-[#105ABD] text-white rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0d4a94] transition-colors'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResearchDisplay;