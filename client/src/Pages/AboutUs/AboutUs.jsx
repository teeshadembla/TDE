import react from 'react';
import HeroSection from '../../components/AboutUs/HeroSection';
import OurMission from '../../components/AboutUs/OurMission';
import CoreValuesPage from '../../components/AboutUs/CoreValuePage';  
import WhatWeDo from '../../components/AboutUs/WhatWeDo';  

const AboutUs = () => {
    return (
        <>
            <HeroSection/>
            <OurMission/>
            <CoreValuesPage/>
            <WhatWeDo/>
        </>
    );
}

export default AboutUs;