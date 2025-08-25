import React from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CustomCarousel from "../components/CustomCarousel";
import ThinkTank from "../components/ThinkTank";
import MissionSection from "../components/MissionSection";
import YouTubeVideoGrid from "../components/YoutubeVideoGrid";
import Footer from "../components/Footer";
import DiscoverSection from "../components/DiscoverSection";
import EarthScene from "../components/EarthScene.jsx";

const HomePage = () =>{
    return(
        <div className="flex flex-col">
            {/* <EarthScene/>  */}
            <CustomCarousel/>
            <ThinkTank/>
            <YouTubeVideoGrid/>
            <DiscoverSection/>
            <MissionSection/>
            <Footer/>
        </div>
    )
}

export default HomePage;