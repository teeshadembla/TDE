
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import FAQSection from '../components/ExecutiveFellowships/FAQSection.jsx';
import Banner from '../components/Events/IndividualEventPage/Banner.jsx';
import EventDetails from '../components/Events/IndividualEventPage/EventDetails.jsx';
import Registrations from '../components/DavosLaunch/Registrations.jsx';
import axiosInstance from '../config/apiConfig.js';
import PanelSessions from '../components/DavosLaunch/PanelSessions.jsx';
import VideoSection from '../components/DavosLaunch/VideoSection.jsx';
import DavosDelegates from '../components/DavosLaunch/DavosDelegates.jsx';
import Footer from "../components/Footer.jsx";
import Highlights from "../components/DavosLaunch/Highlights.jsx";
import YouTubeVideoGrid from '../components/YoutubeVideoGrid.jsx';
import { panelSessionData, registrationData, phaseData, davosFaqs } from '../components/DavosLaunch/Data.js'; 


// ─── Davos Delegate FAQ data (transcribed from design images) ───────────────

const DavosLaunch = () => {
    const [event, setEvent] = useState();
    const [delegates, setDelegates] = useState([]);    

    useEffect(()=>{
        const fetchDavos = async() => {
            try{
                const res = await axiosInstance.get(`/api/events/getEventById/69a9ac20317bff1ec3a9eb7d`)
                setEvent(res.data.event);
            }catch(err){
                console.log("This error is occurring while trying to fetch Davos data.");
            }
        }

        fetchDavos();
    }, [])

    return(
        <>
            <Banner image={event?.image?.url} title={event?.title} subtitle={event?.subtitle} locationType={event?.locationType} type={event?.type}/>

            <EventDetails event={event}/>

            <Registrations registrations={registrationData}/>

            <PanelSessions panelSessions={panelSessionData}/>

            <VideoSection />

            
            <DavosDelegates delegates={delegates} year={2026}/>

            <FellowshipTimeline
                alternating={true}
                headerTitle="The Digital Economist at Davos"
                headerSubtitle="Our Impact over the years"
                phases={phaseData}
            />

            <FAQSection
                faqs={davosFaqs}
                backgroundColor="bg-white"   // or whatever dark bg your page uses
                textColor="text-black"
                answerColor="text-neutral-400"
                borderColor="border-neutral-700"
                seeMoreColor="text-neutral-400"
            />


            <DavosDelegates delegates={delegates} year={2025}/>

            

            // Use a 4-col photo grid on large screens
            <Highlights photoCols="grid-cols-2 lg:grid-cols-4" />

            <Footer/>
        </>

        
    )
}

export default DavosLaunch;




const FellowshipTimeline = ({
  // Content props
  phases = [
    {
      id: 1,
      title: "Orientation",
      description: "Kicking off workgroups with ongoing projects and partnerships.",
    },
    {
      id: 2,
      title: "Immersion",
      description: "Period of in-depth research and development, writing, and publications.",
    },
    {
      id: 3,
      title: "Dissemination",
      description: "Busy fall period focused on engagement and dissemination.",
    },
    {
      id: 4,
      title: "Impact",
      description: "Impact captured in the 5-year impact report, unveiled in Davos.",
    }
  ],
  
  // Header props
  headerTitle = "Executives Fellowship Structure",
  headerSubtitle = "The Fellowship is spread over 4 phases",
  
  // Styling props
  colors = {
    background: "bg-neutral-900",
    text: "text-white",
    subtitle: "text-gray-400",
    description: "text-gray-300",
    staticLine: "bg-[rgb(6,44,101)]",
    animatedLine: "bg-[rgb(0,121,255)]",
    checkpoint: "bg-blue-500",
    checkpointActive: "bg-blue-400",
  },
  
  // Layout props
  phaseHeight = "40vh",
  showHeader = true,

  // NEW: When true, layout alternates per phase (year left → desc right, then desc left → year right)
  // When false (default), year is always left and description always right — preserving original behavior
  alternating = false,
  
  // Animation props
  scrollStartTrigger = 0.5,
  scrollEndTrigger = 0.5,

  onApplyClick
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const startPoint = viewportHeight * scrollStartTrigger;
      const endPoint = viewportHeight * scrollEndTrigger;
      
      const distanceScrolled = startPoint - rect.top;
      const totalScrollDistance = containerHeight - (startPoint - endPoint);
      
      const progress = Math.max(0, Math.min(1, distanceScrolled / totalScrollDistance));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollStartTrigger, scrollEndTrigger]);

  const getCheckpointProgress = (index) => {
    const checkpointPosition = index / (phases.length - 1);
    return scrollProgress >= checkpointPosition;
  };

  // Determine layout direction for a given phase index
  // When alternating=false: always yearLeft (original behavior)
  // When alternating=true: even indices → year left, odd indices → year right
  const isYearLeft = (index) => {
    if (!alternating) return true;
    return index % 2 === 0;
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      {/* Header Section */}
      {showHeader && (
        <div className="text-center py-12 md:py-20 px-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <h1 className="text-4xl text-[43.2px] md:text-6xl lg:text-[43.2px] font-bold mb-6">
            {headerTitle}
          </h1>
          <h3 className="text-lg md:text-xl lg:text-[27.2px] font-bold text-[27.2px] text-[rgb(159,159,159)]">
            {headerSubtitle}
          </h3>
        </div>
      )}

      {/* Timeline Container */}
      <div ref={containerRef} className="relative px-4 md:px-8 lg:px-16 xl:px-24 pb-20">
        {/* Center line container */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 top-0" 
          style={{ height: `calc(${phases.length} * ${phaseHeight})` }}
        >
          {/* Static blue timeline line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[rgb(6,44,101)] opacity-30`} />
          
          {/* Animated lighter blue line that fills progressively */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 w-1 ${colors.animatedLine}`}
            style={{ 
              height: `${scrollProgress * 100}%`,
              boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)'
            }}
          />
        </div>

        {/* Timeline Phases */}
        <div className="relative">
          {phases.map((phase, index) => {
            const yearLeft = isYearLeft(index);
            const isActive = getCheckpointProgress(index);

            return (
              <div
                key={phase.id}
                className="flex items-center justify-center"
                style={{ height: phaseHeight }}
              >
                <div className="w-full max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">

                    {/* Left column */}
                    <div className="md:col-span-5 w-[400px] text-center md:text-right md:pr-4 lg:pr-8 " >
                      {yearLeft ? (
                        // Year on the left
                        <h2 className="sm:text-[10px] montserrat-text md:text-[12px] lg:text-[43.2px] font-bold">
                          {phase.title}
                        </h2>
                      ) : (
                        // Description on the left
                        <p className={`text-[rgb(217,217,217)] dmsans-text font-normal text-[18px] leading-tight transition-all duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-40'
                        }`}>
                          {phase.description}
                        </p>
                      )}
                    </div>

                    {/* Timeline Checkpoint - Center */}
                    <div className="md:col-span-2 flex items-center justify-center relative order-first md:order-none">
                      <div className={`relative z-10 w-3 h-3 md:w-4 md:h-4 rounded-sm border-4 border-gray-900 transition-all duration-500 ${
                        isActive
                          ? `${colors.checkpointActive} scale-125 shadow-lg shadow-blue-400/50` 
                          : `${colors.checkpoint} opacity-30 scale-100`
                      }`}>
                        {isActive && (
                          <div className={`absolute inset-0 rounded-sm ${colors.checkpointActive} animate-ping opacity-20`} />
                        )}
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="md:col-span-5 w-[400px] text-center md:text-left md:pl-4 lg:pl-8 dmsans-text" >
                      {yearLeft ? (
                        // Description on the right
                        <p className={`text-[rgb(217,217,217)] font-light text-[18px] leading-tight transition-all duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-40'
                        }`}>
                          {phase.description}
                        </p>
                      ) : (
                        // Year on the right
                        <h2 className="sm:text-[10px] montserrat-text md:text-[12px] lg:text-[43.2px] font-bold">
                          {phase.title}
                        </h2>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pb-10 justify-center items-center mt-10">
        <button
          onClick={onApplyClick}
          className="all-[unset] inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis bg-[#0445AF] text-white text-[28px] rounded-[6px] px-[46px] font-bold h-[70px] cursor-pointer leading-[70px] text-center m-0 no-underline font-['Helvetica',Arial,sans-serif]"
        >
          Apply Now
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

