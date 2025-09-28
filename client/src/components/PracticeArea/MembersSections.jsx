import react from "react";
import { useNavigate } from "react-router";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

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

const MembersSections = ({members,}) => {
    return (
        <div className="min-h-screen bg-neutral-900">
            {/* Header */}
            <div className="pt-10 pb-12">
                <h1 className="text-4xl font-bold text-center text-white">Meet The Members</h1>
            </div>
            
            {/* Responsive Grid Container */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Grid with responsive columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {members.map((member, index) => (
                            <PersonCard 
                                key={index}
                                name={member.name}
                                title={member.title}
                                imageUrl={member.imgUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembersSections;