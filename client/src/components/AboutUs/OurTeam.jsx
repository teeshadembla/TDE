import React from "react";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from "react-router-dom";

const additionalTeamMembers = [
  {
    name: "Resham Kataria",
    title: "TECHNOLOGY SPECIALIST",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857b9fedd78e3f5bf2d6784_c3d6ef63-0e19-4217-98e0-5be47c4f2d60_edited.avif" // Add image URL here
  },
  {
    name: "Zia Esmalin",
    title: "EDITOR",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857ba4b68c32eca04f50b6d_10.avif" // Add image URL here
  },
];

const PersonCard = ({ name, title, imageUrl }) => {
    const navigate = useNavigate();
    
    const handleViewProfile = () => {
        // Create URL-friendly name by replacing spaces with dashes and removing special characters
        const urlFriendlyName = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and dashes
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .trim();
        
        navigate(`/about/profile/${urlFriendlyName}`);
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
                        className="flex items-center group-hover:bg-[rgb(6,44,101)] justify-center rounded-[4px] box-border bg-[rgb(71,70,70)] text-[rgb(159,159,159)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[30px] w-[150px] gap-[7px] mb-[10px] py-[7px] px-[14px] cursor-pointer text-left"
                    >
                        <h6 id="view-profile" className="flex items-stretch justify-center box-border relative text-white dmsans-text text-[11.9px] font-normal leading-[15.47px] h-[16px] w-[64.3625px] m-0 cursor-pointer text-left z-[1]">View Profile </h6> 
                        <ArrowOutwardIcon fontSize="14px"/>
                    </button>
                </div>
            </div>
        </div>
    )
}


const OurTeam = () => {
    return (
        <div id="team-section" className="flex justify-center box-border bg-[rgb(23,23,23)] text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] h-fit w-full pt-0 px-[64px]">

        <div id="w-layout-block-container" className="flex flex-col flex-nowrap items-center justify-center box-border text-[#333333] font-[Arial,'Helvetica_Neue',Helvetica,sans-serif] text-[14px] leading-[20px] text-left w-[1092px] max-w-[1092px] h-[1044.56px] mx-[110px] gap-y-[46px] gap-x-[46px]">
            {/* Header */}
            <h3 id="heading-invert" className="text-4xl text-whiteblock box-border text-[#f1f1f1] font-['DM_Sans',sans-serif] text-[23.8px] font-bold leading-[28.56px] text-center w-[111.387px] h-[28.5625px] mt-0 mb-[10px]">Our Team</h3>
            
            
            {/* Responsive Grid Container */}
            <div id="w-dyn-list" className="block box-border text-[#333333] font-[Arial,'Helvetica_Neue',Helvetica,sans-serif] text-[14px] leading-[20px] text-left w-[1092px] h-[868px]">
                <div id="w-dyn-list-items" className="grid box-border text-[#333333] font-[Arial,'Helvetica_Neue',Helvetica,sans-serif] text-[14px] leading-[20px] text-left w-[1092px] h-[868px] grid-cols-[261px_261px_261px_261px] grid-rows-[426px_426px] auto-cols-[1fr] gap-x-[16px] gap-y-[16px]">
                    {/* Grid with responsive columns */}
                        {additionalTeamMembers.map((member, index) => (
                            <PersonCard 
                                key={index}
                                name={member.name}
                                title={member.title}
                                imageUrl={member.imageUrl}
                            />
                        ))}
                </div>
            </div>
        </div>
        </div>
    );
}

export default OurTeam;