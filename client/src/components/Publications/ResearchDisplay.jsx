import React, { useEffect, useState } from 'react';
import ResearchItem from './ResearchItem.jsx';
import axiosInstance from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';

const ResearchDisplay = () => {
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [selectedWorkgroup, setSelectedWorkgroup] = useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
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
            console.log("Full API response:", response);
            console.log("Response data:", response.data);
            
            // Handle different possible response structures
            const paperData = response.data?.data || response.data?.papers || response.data || [];
            
            console.log("These are all of the research papers that have been retrieved--->", paperData);
            
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
            console.log("This error occurred while trying to fetch all research papers from the backend.--->", err);
            setPapers([]);
            setFilteredPapers([]);
        }
    }

    fetchPapers();
}, []);

    // Apply filters whenever selection changes
    useEffect(() => {
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
    };

    const handleDocTypeChange = (e) => {
        setSelectedDocType(e.target.value);
    };

    return (
        <div id='publication-list' className='bg-[#000] p-0'>
            <div id='publication-list wrapper' className='w-full max-w-[1092px] flex flex-col justify-center items-stretch gap-x-16 gap-y-16 mx-auto px-0 p-0 relative'>
                <div id='publication-list-top' className='flex flex-col justify-between items-start gap-x-[40px] gap-y-[40px]'>
                    <h4 className='text-white font-sans text-[32px] ml-[105px] my-10 font-semibold'>All Articles</h4>
                    <div className='flex justify-end items-stretch w-full gap-x-4 gap-y-4 px-4'>
                        <div id='filter-workgroup' className='flex flex-col gap-x-1 gap-y-1'>
                            <select
                                value={selectedWorkgroup}
                                onChange={handleWorkgroupChange}
                                className='bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-gray-500'
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
                                className='bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-gray-500'
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
                <div id='publication-list-bottom' className='flex justify-center'>
                    <div id='w-dyn-list' className='w-[894px] min-h-[1249.8px]'>
                        <div id='list' className='grid gap-x-4 gap-y-4 grid-rows-[auto_auto] grid-cols-2 auto-cols-fr'>
                            {filteredPapers?.map((paper) => (
                                <div className='cursor-pointer align-middle' onClick={() => navigate(`/research-paper/${paper._id}`)} key={paper._id}>
                                    <ResearchItem paper={paper}/>
                                </div>
                            ))}
                        </div>
                        {filteredPapers.length === 0 && (
                            <div className='text-white text-center py-8'>
                                No papers found matching the selected filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResearchDisplay;