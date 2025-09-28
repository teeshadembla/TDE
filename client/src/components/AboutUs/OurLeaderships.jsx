import React from "react";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Navroop Sahdev",
    designation: "FOUNDER & CEO",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6856661fb51eba837ad92707_439431361_976807851118684_5257066573451305580_n.jpg"
  },
  {
    name: "Jose Luis Carvalho",
    designation: "EXECUTIVE DIRECTOR, CENTER OF EXCELLENCE",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68566672c0e2c8d0c62fbf02_Jose-p-1600.jpg"
  },
  {
    name: "Dr. Nikhil Varma",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, BLOCKCHAIN & DIGITAL ASSETS",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685666c2b4074bbe012ec91b_Dr.%20Nikhil%20Varma%20(updated)-p-1600.jpg"
  },
  {
    name: "Sandy Carter",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, APPLIED AI",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857b01f00a40d4c5fa2254c_Sandy%20Carter.png"
  },
  {
    name: "Dr. Maha Hosain Aziz",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, POLICY",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f251bc6b6874a4a5a96a_Maha%20Hosain%20Aziz%20headshot_edited.avif"
  },
  {
    name: "Shannon Kennedy",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, HEALTHCARE",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658c70df72fa50900c91e5_Untitled%20design%20(1).png"
  },
  {
    name: "Bhuva Shakti",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, GOVERNANCE",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658b96b4bcb2ecf4ff15aa_6858f43a03e8e51000553d01_Bhuva%20Shakti%20-%20Website%20-%201%20(1).jpg"
  },
  {
    name: "Arvinder Singh Kang",
    designation: "PROGRAM DIRECTOR",
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68659a4b8e0a6936c167efdb_IMG_0793%20(1).avif"
  },
  {
    name: "Alex Kontoleon",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW, SUSTAINABILITY", 
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68aef2a548eaf8b4529e5e6f_Strategic%20Content%20and%20Policy%20Associate%20(3).png"
  },
  {
    name: "Dr. Melodena Stephens",
    designation: "NON-EXEC CHAIR & SENIOR FELLOW", 
    imageLink: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68b5c60eacb8170797dde541_Strategic%20Content%20and%20Policy%20Associate%20(21).png"
  }
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
        <div className="w-full max-w-sm mx-auto bg-neutral-800 rounded-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h1 className="font-sans cursor-pointer font-bold text-lg mb-2 text-white hover:text-gray-300 transition-colors">
                    {name}
                </h1>
                <p className="text-[#9f9f9f] text-xs font-normal font-sans mb-4 leading-relaxed">
                    {title}
                </p>
                <button 
                    onClick={handleViewProfile}
                    className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 p-2 rounded-[4px] w-full flex items-center justify-center gap-2 text-white transition-colors text-sm"
                >
                    View Profile 
                    <ArrowOutwardIcon className="text-sm"/>
                </button>
            </div>
        </div>
    )
}

const OurLeaderships = () => {
    return (
        <div className="min-h-screen bg-neutral-900">
            {/* Header */}
            <div className="pt-10 pb-12">
                <h1 className="text-4xl font-bold text-center text-white">Leadership</h1>
            </div>
            
            {/* Responsive Grid Container */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Grid with responsive columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {teamMembers.map((member, index) => (
                            <PersonCard 
                                key={index}
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