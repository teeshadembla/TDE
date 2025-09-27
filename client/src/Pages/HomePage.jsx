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
import Demo from "../components/HomePage/Demo";
import { Ban } from "lucide-react";

const HomePage = () =>{
    return(
        <div className="flex flex-col">
            <LandingComponent/>
            <ThinkDoTankSection/>
            <ProjectsSection/>
            <Banner/>
            <CustomCarousel/>
            <MissionSection/>
            <Footer/>
        </div>
    )
}

export default HomePage;