import React from "react";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    _id: "1",
    name: "Navroop Sahdev",
    designation: "Founder & CEO",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6856661fb51eba837ad92707_439431361_976807851118684_5257066573451305580_n.jpg"
  },
  {
    _id: "2",
    name: "Jose Luis Carvalho",
    designation: "Executive Director, Center of Excellence",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68566672c0e2c8d0c62fbf02_Jose-p-1600.jpg"
  },
  {
    _id: "3",
    name: "Ambriel Pouncy",
    designation: "Global Head of Engagement & Ecosystem Innovation, The Digital Economist Fellows",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939a4123e131fba7cc6c81e_Screenshot%202025-12-10%20011112.png"
  },
  {
    _id: "4",
    name: "Arvinder Singh Kang",
    designation: "Program Director",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68659a4b8e0a6936c167efdb_IMG_0793%20(1).avif"
  },
  {
    _id: "5",
    name: "Sandy Carter",
    designation: "Non-exec chair and Senior Executive Fellow, Applied Artificial Intelligence",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857b01f00a40d4c5fa2254c_Sandy%20Carter.png"
  },
  {
    _id: "6",
    name: "Dr. Nikhil Varma",
    designation: "Non-exec chair and Senior Executive Fellow, Digital Assets & Blockchain",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685666c2b4074bbe012ec91b_Dr.%20Nikhil%20Varma%20(updated)-p-1600.jpg"
  },
  {
    _id: "7",
    name: "Dr. Maha Hosain Aziz",
    designation: "Non-exec chair and Senior Executive Fellow, Tech Policy & Governance",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f251bc6b6874a4a5a96a_Maha%20Hosain%20Aziz%20headshot_edited.avif"
  },
  {
    _id: "8",
    name: "Bruce Armstrong Taylor",
    designation: "Non-exec chair and Senior Executive Fellow, Regenerative Digital Infrastructure 5.0",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/698c44f8fa3379976a639e12_Bruce%20Armstrong%20Taylor.jpg"
  },
  {
    _id: "9",
    name: "Shannon Kennedy",
    designation: "Non-exec chair and Senior Executive Fellow, Healthcare Innovation",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658c70df72fa50900c91e5_Untitled%20design%20(1).png"
  },
  {
    _id: "10",
    name: "Alex Kontoleon",
    designation: "Non-exec chair and Senior Executive Fellow, Sustainability in Tech",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68aef2a548eaf8b4529e5e6f_Strategic%20Content%20and%20Policy%20Associate%20(3).png"
  },
  {
    _id: "11",
    name: "Dr. Melodena Stephens",
    designation: "Non-exec chair and Senior Executive Fellow, Tech Policy & Governance",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68b5c60eacb8170797dde541_Strategic%20Content%20and%20Policy%20Associate%20(21).png"
  },
  {
    _id: "12",
    name: "Dr. Dimitrios Salampasis",
    designation: "Non-exec chair and Senior Executive Fellow, Quantum Computing",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/698ad857a31ae6b2e96a6b64_Dr.%20Dimitrios%20Salampasis.jpg"
  },
  {
    _id: "13",
    name: "Japneet Kaur",
    designation: "Non-exec chair and Senior Executive Fellow, Cyber Studio",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/698c40210af57c1acbeb3fa5_Japneet%20Kaur.jpg"
  }
];


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

const OurLeaderships = () => {
    return (
        <div id="team-section" className="flex justify-center box-border bg-[rgb(23,23,23)] text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] w-full pt-0 px-[64px] pb-[60px]">
        <div id="w-layout-block-container" className="flex items-center justify-center flex-col flex-nowrap box-border text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] w-[1092px] gap-[46px] pt-[60px] mx-[110px]">
            {/* Header */}
            <h1 id="title-section-light" className="block box-border text-white montserrat-text text-[35px] font-bold leading-[38.5px] h-[38.5px] w-[203.163px] mt-[60px] mb-[10px] mx-0 text-left">Leadership</h1>
            <h4 id="subtitle-team-section" className="block box-border text-[rgb(204,203,203)] dmsans-text text-[18.2px] font-normal leading-[21.84px] h-[65.5125px] w-[873.6px] mt-0 mb-[10px] mx-0 text-center">
                Our team is a global collective of bold thinkers and doers—each bringing unique expertise and lived experience to reimagine systems that serve people and the planet.
            </h4>
            
            
            {/* Responsive Grid Container */}
            <div id="w-dyn-list"  className="block box-border text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] w-[1092px] text-left">
                <div id="collection-list" className="grid box-border text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] w-[1092px] text-left gap-[16px] grid-cols-[261px_261px_261px_261px] auto-cols-fr">
                    {/* Grid with responsive columns */}
                    {teamMembers.map((member, index) => (
                        <PersonCard 
                            key={index}
                            id={member._id}
                            name={member.name}
                            title={member.designation}
                            imageUrl={member.imageLink}
                        />
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}

export default OurLeaderships;