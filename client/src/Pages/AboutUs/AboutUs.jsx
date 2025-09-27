import react from 'react';
import HeroSection from '../../components/AboutUs/HeroSection';
import OurMission from '../../components/AboutUs/OurMission';
import CoreValuesPage from '../../components/AboutUs/CoreValuePage';  
import WhatWeDo from '../../components/AboutUs/WhatWeDo'; 
import PartnershipsSection from '../../components/AboutUs/PartnershipsSection'; 

const AboutUs = () => {
    return (
        <>
            <HeroSection/>
            <OurMission/>
            <CoreValuesPage/>
            <WhatWeDo/>
            <PartnershipsSection/>
        </>
    );
}

export default AboutUs;