import React from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CustomCarousel from "../components/CustomCarousel";
import ThinkDoTankSection from "../components/ThinkDoTankSection";
import MissionSection from "../components/MissionSection";
import YouTubeVideoGrid from "../components/YoutubeVideoGrid";
import Footer from "../components/Footer";
import DiscoverSection from "../components/DiscoverSection";
import LandingComponent from "../components/HomePage/LandinPage";
import ProjectsSection from "../components/HomePage/ProjectsSection";
import Banner from "../components/HomePage/Banner";
import SubscribeToNewsletter from "../components/Events/SubscribeToNewsletter.jsx";
import HowWeDriveImpact from "../components/HomePage/HowWeDriveImpact.jsx";
import { Ban } from "lucide-react";

const HomePage = () =>{
    return(
        <div className="flex flex-col">
            <LandingComponent/>
            <ThinkDoTankSection/>
            <HowWeDriveImpact/>
            <ProjectsSection/>
            <Banner/>
            <CustomCarousel/>
            <SubscribeToNewsletter/>
            <Footer/>
        </div>
    )
}

export default HomePage;