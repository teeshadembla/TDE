import react from "react";
import HeroCarousel from "../../components/PostLoginLandingPage/HeroCarousel.jsx";
import UpcomingEvents from "../../components/PostLoginLandingPage/UpcomingEvents.jsx";
import { PublicationCarousel} from "../../components/PostLoginLandingPage/RecommendedPublications.jsx";
import ExpertiseSection from "../../components/PostLoginLandingPage/ExpertiseSection.jsx";
import PracticeHighlightsSection from "../../components/PostLoginLandingPage/PracticeHighlightsSection.jsx";

const PostLoginLandingPage = () =>{
    return(
        <>
        <HeroCarousel onHamburgerClick={()=> console.log("Click")}/>
            <UpcomingEvents/>
            <PublicationCarousel/>
            <ExpertiseSection/>
            <PracticeHighlightsSection/>
        </>
    )
}

export default PostLoginLandingPage;