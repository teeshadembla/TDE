import React from 'react';
import { useParams } from 'react-router';

// LinkedIn icon component (you can replace with actual LinkedIn icon from your icon library)
const LinkedInIcon = () => (
  <svg 
    className="w-6 h-6" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const ProfilePage = ({ 
  role, 
  name, 
  imageUrl, 
  about, 
  affiliations = [],
  socialLinks = [],
  backgroundColor = "bg-black",
  textColor = "text-white"
}) => {
  return (
    <div className={`min-h-screen ${backgroundColor} ${textColor} relative overflow-hidden`}>
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              
              {/* Left Column - Text Content */}
              <div className="space-y-6 lg:space-y-8">
                {/* Role */}
                <div>
                  <p className="text-sm sm:text-base font-medium uppercase tracking-wider text-gray-300 mb-2">
                    {role}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {name}
                  </h1>
                </div>
              </div>
              
              {/* Right Column - Profile Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[30rem] overflow-hidden rounded-lg shadow-2xl">
                  <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* About & Details Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              
              {/* About Section */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                  About
                </h2>
                <div className="text-gray-300 text-base sm:text-lg leading-relaxed space-y-4">
                  {Array.isArray(about) ? (
                    about.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{about}</p>
                  )}
                </div>
              </div>
              
              {/* Affiliations & Social Section */}
              <div className="space-y-8">
                {/* Affiliations */}
                {affiliations.length > 0 && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                      Affiliations
                    </h3>
                    <div className="space-y-3">
                      {affiliations.map((affiliation, index) => (
                        <p key={index} className="text-gray-300 text-base sm:text-lg">
                          {affiliation}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                          aria-label={`${name} on ${link.platform}`}
                        >
                          {link.platform === 'linkedin' && <LinkedInIcon />}
                          {link.icon && link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example Usage Component
const ExampleProfilePage = () => {
  const sampleData = {
    role: "NON-EXEC CHAIR & SENIOR FELLOW, HEALTHCARE",
    name: "Shannon Kennedy",
    imageUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658c70df72fa50900c91e5_Untitled%20design%20(1).png",
    about: "Shannon is the Founder & CEO of Sekhmet Advisors, with 30 years of expertise in healthcare policy, compliance, and AI ethics. Passionate about equitable innovation, she supports start-ups advancing technology for community health.",
    affiliations: [
      "Founder & CEO Sekhmet Advisors"
    ],
    socialLinks: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/shannon-kennedy"
      }
    ]
  };

  return <ProfilePage {...sampleData} />;
};

export default ExampleProfilePage;