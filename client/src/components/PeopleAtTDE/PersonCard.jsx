import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar, FileText, Award } from 'lucide-react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


// Person Card Component
const PersonCard = ({ id,name, title, imageUrl }) => {
    const navigate = useNavigate();

    
    const handleViewProfile = () => {
        
        navigate(`/about/profile/${id}`);
    };


    return(
        <div id="w-dyn-item" className="block box-border text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] h-[426px] w-[261px] text-left">
            <div onClick={handleViewProfile} id="w-inline-block" className="inline-block box-border bg-transparent text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[426px] w-[261px] max-w-full cursor-pointer text-left" >
                <div id="div-block-75" className="block box-border rounded-t-[8px] text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[261px] w-[261px] overflow-hidden cursor-pointer text-left">
                    <img 
                        src={imageUrl} 
                        alt={name}
                        className="inline-block box-border rounded-t-[8px] text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[261px] w-[261px] max-w-full aspect-square object-cover overflow-clip align-middle cursor-pointer text-left"
                    />
                </div>

                <div id="fellows-card-name-box" className="flex flex-col flex-nowrap justify-between box-border bg-[rgb(38,38,38)] hover:bg-[rgb(0,74,173)] text-[rgb(0,0,238)] dmsans-text text-[14px] group font-normal leading-[18.2px] h-[165px] w-[261px] pt-[15px] pb-[15px] pl-[10px] rounded-b-[8px] cursor-pointer text-left">
                    <h3 id="heading-3" className="block box-border text-white dmsans-text text-[18px] font-bold leading-[21.6px] h-[21.6px] w-[251px] mt-[15.05px] mb-[2.5px] mx-0 cursor-pointer text-left">
                        {name}
                    </h3>
                    <div id="profile-card" className="block box-border text-[rgb(159,159,159)] dmsans-text text-[12px] font-normal leading-[18.2px] h-[18.2px] w-[251px] mb-[10px] pr-[2.5px] cursor-pointer text-left">
                        {title}
                    </div>
                    <button 
                        id="button-primary-leadership"
                        onClick={handleViewProfile}
                        className="flex items-center group-hover:bg-[rgb(6,44,101)] justify-center rounded-[4px] box-border bg-[rgb(71,70,70)] text-[rgb(159,159,159)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[30px] w-[150px] gap-[7px] my-[15px] py-[7px] px-[14px] cursor-pointer text-left"
                    >
                        <h6 id="view-profile" className="flex items-stretch justify-center box-border relative text-white dmsans-text text-[11.9px] font-normal leading-[15.47px] h-[16px] w-[64.3625px] m-0 cursor-pointer text-left z-[1]">View Profile </h6> 
                        <ArrowOutwardIcon fontSize="14px"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PersonCard;