import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar, FileText, ExternalLink, Award, Briefcase, Link } from 'lucide-react';
import { useParams } from 'react-router';
import axiosInstance from '../../config/apiConfig';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const publications = [
    { title: "Digital Transformation in Modern Economics", year: "2024", coAuthors: ["Dr. Smith", "Prof. Wilson"] },
    { title: "The Future of Cryptocurrency Markets", year: "2023", coAuthors: ["Dr. Brown"] },
    { title: "AI Impact on Financial Services", year: "2023", coAuthors: ["Prof. Davis", "Dr. Lee"] }
  ];

  const {user_id} = useParams();

  useEffect(()=>{

    const fetchUserDataById = async() =>{
      if(!user_id) return;
      try{
        console.log("Finding user with the following id--->",user_id);
        const response = await axiosInstance.get(`/api/user/${user_id}`);
        console.log("User data fetched--->", response.data);
        setUser(response.data.user);
      }catch(error){
        console.log("Error fetching user by id--->", error);
      }
    }
    
    fetchUserDataById();

  },[])

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div 
        className="w-full h-[300px] relative bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68583671641482c4312a68cb_header.png")'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <button 
          onClick={() => navigate("/fellowship/fellows")}
          className="flex items-center text-white hover:text-gray-200 transition-colors mb-8"
        >
          ← Back to Our People
        </button>
        
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            {/* Left Column - Photo and Quick Info */}
            <div className="space-y-6">
              <img 
                src={user.profilePicture} 
                alt={user.FullName}
                className="w-32 h-32 aspect-[3/4] object-cover rounded-lg"
              />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={16} />
                  <span>{user.company}</span>
                </div>
                {user.socialLinks && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link size={16} />
                    <a href={user.socialLinks?.LinkedIn} target="_blank" rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline">LinkedIn Profile</a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Main Content */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                  {user.role || "NON-EXEC CHAIR & SENIOR FELLOW, GOVERNANCE"}
                </p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{user.FullName}</h1>
                <p className="text-xl text-gray-600">{user.title}</p>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">About</h2>
                {user.introduction && (
                  <p className="text-gray-700 leading-relaxed">{user.introduction}</p>
                )}
              </div>
              
              {user.expertise && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.expertise.map((exp, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          
          {/* Affiliations Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Affiliations</h2>
            <div className="space-y-4 text-black">
              {user.title}
            </div>
            <div className="space-y-4 text-black">
              {user.company}
            </div>
          </div>

          {/* Publications Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Publications with Digital Economist
            </h2>
            
            <div className="grid gap-6">
              {publications.map((pub, index) => (
                <div key={index} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">{pub.title}</h3>
                      <p className="text-sm text-gray-600">
                        Co-authors: {pub.coAuthors.join(", ")}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                      {pub.year}
                    </span>
                  </div>
                  <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                    Read Article <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};


export default UserProfile;
