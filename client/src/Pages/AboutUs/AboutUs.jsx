import react from 'react';
import HeroSection from '../../components/AboutUs/HeroSection';
import OurMission from '../../components/AboutUs/OurMission';
import CoreValuesPage from '../../components/AboutUs/CoreValuePage';  
import WhatWeDo from '../../components/AboutUs/WhatWeDo'; 
import PartnershipsSection from '../../components/AboutUs/PartnershipsSection'; 
import OurLeaderships from '../../components/AboutUs/OurLeaderships';   
import OurTeam from '../../components/AboutUs/OurTeam';
import Footer from "../../components/Footer";

const AboutUs = () => {
    return (
        <>
            <HeroSection/>
            <OurMission/>
            <CoreValuesPage/>
            <WhatWeDo/>
            <PartnershipsSection/>
            <OurLeaderships/>
            <OurTeam/>
            <Footer/>
        </>
    );
}

export default AboutUs;