import React from "react";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from "react-router-dom";

const additionalTeamMembers = [
  {
    name: "Riddhima Gangwal",
    title: "OPERATIONS SPECIALIST",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857b9cddd1f2354cc1ae5be_IMG_9230.avif" // Add image URL here
  },
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
  {
    name: "Salman Pangestu",
    title: "GRAPHIC DESIGNER",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857ba6fd6d2e5f216bf5075_IMG_0591.avif" // Add image URL here
  },
  {
    name: "Merry Carlina",
    title: "CREATIVE DESIGNER",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/689604c7ab0c87674824d642_Merry%20Carlina.avif" // Add image URL here
  },
  {
    name: "Mickaël Lafont",
    title: "ENTERPRISE TRANSFORMATION MANAGER",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/689605151684f42febb9ba73_Image%20800x722.avif" // Add image URL here
  },
  {
    name: "Shilpi Kakani",
    title: "STRATEGIC CONTENT & POLICY ASSOCIATE",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6896060f26f9ee9b58e1932b_Shilpi.png%20800x722.avif" // Add image URL here
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
                <button onClick={handleViewProfile} className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 p-2 rounded-[4px] w-full flex items-center justify-center gap-2 text-white transition-colors text-sm">
                    View Profile 
                    <ArrowOutwardIcon className="text-sm"/>
                </button>
            </div>
        </div>
    )
}

const OurTeam = () => {
    return (
        <div className="min-h-screen bg-neutral-900">
            {/* Header */}
            <div className="pt-10 pb-12">
                <h1 className="text-4xl font-bold text-center text-white">Our Team</h1>
            </div>
            
            {/* Responsive Grid Container */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Grid with responsive columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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