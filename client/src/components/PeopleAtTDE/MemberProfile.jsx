import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar, FileText, ExternalLink, Award, Briefcase, Link, Linkedin } from 'lucide-react';
import { useParams } from 'react-router';
import axiosInstance from '../../config/apiConfig';
import { teamMembers } from './Data';

const MemberProfile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const publications = [
    { title: "Digital Transformation in Modern Economics", year: "2024", coAuthors: ["Dr. Smith", "Prof. Wilson"] },
    { title: "The Future of Cryptocurrency Markets", year: "2023", coAuthors: ["Dr. Brown"] },
    { title: "AI Impact on Financial Services", year: "2023", coAuthors: ["Prof. Davis", "Dr. Lee"] }
  ];

  const {id} = useParams();

 useEffect(() => {
    // Find user from teamMembers array using the id from params
    const foundUser = teamMembers.find(member => member._id === id);
    
    if (foundUser) {
      console.log("User found--->", foundUser);
      setUser(foundUser);
    } else {
      console.log("User not found with id--->", id);
      // Optional: navigate back or show error
      // navigate("/fellowship/fellows");
    }
  }, [id]);

  return (
    <>
<div id="section-6" className="w-full h-[182.4px] flex flex-row flex-nowrap items-center justify-start box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] bg-[url('https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68583671641482c4312a68cb_header.png')] bg-cover bg-repeat bg-[position:100%_50%] overflow-visible">
        <div id="w-layout-blockcontainer" className="block flex-grow flex-shrink basis-0 box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[95.3625px] max-w-[940px] w-full mx-[250px]">
            <div id="text-invert" className="block box-border text-white text-[18px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[20px] w-[648px] text-left">{user?.designation}</div>
            <h2 id='profile-page-hero' className="block box-border text-white text-[37.8px] font-bold leading-[45.36px] montserrat-text h-[45.3625px] w-[648px] mt-[20px] mb-[10px] text-left">{user?.name}</h2>
        </div>
    </div>

    <div id="section-7" className='className="block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[395.7px] w-full"'>
        <div id="w-layout-blockcontainer" className="grid box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[395.7px] w-full max-w-[940px] mt-[40px] mb-[100px] mx-[250px] gap-[16px] grid-cols-[504.438px_100.887px_302.675px] grid-rows-[395.7px] auto-cols-fr">
            <div id="div-block-18" className="block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[395.7px] w-[504.438px] col-start-1 col-end-2 row-start-1 row-end-2">
                <h3 id='About' className="block box-border text-[rgb(51,51,51)] text-[23.8px] font-bold leading-[28.56px] dmsans-text h-[28.5625px] w-[504.438px] mt-[20px] mb-[10px]">About</h3>
                <div id="rich-text-block" className="block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[82.8px] w-[504.438px]">
                    <p className="block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[82.8px] w-[504.438px]">{user?.Introduction}</p>
                </div>
            </div>

            <div id="div-block-17" className='className="block relative box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[395.7px] w-[302.675px] col-start-3 col-end-4 row-start-1 row-end-2 top-[-190px]"'>
                <img src={user.imageLink} className="inline-block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] w-[161px] h-[241.5px] max-w-full align-middle object-cover aspect-[2/3] overflow-clip"></img>
                <h5 id='Affiliations' className="block box-border text-[rgb(22,22,22)] text-[14px] font-semibold leading-[18.2px] font-['DM Sans',sans-serif] h-[18.2px] w-[302.675px] mt-[40px] mb-[10px]">Affiliations</h5>
                <div id="text-block-30" className="block box-border text-[rgb(51,51,51)] text-[14px] leading-[20px] font-[Arial,Helvetica,sans-serif] h-[20px] w-[302.675px] mt-[20px]">{user?.title} {user?.company}</div>
                <a href={user?.socialLinks?.LinkedIn}><Linkedin size={14}/></a>
            </div>
        </div>
    </div>
    </>
  )
};


export default MemberProfile;
