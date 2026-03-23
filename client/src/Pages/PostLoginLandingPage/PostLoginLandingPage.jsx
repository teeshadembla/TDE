import react,  {useEffect, useState} from "react";
import HeroCarousel from "../../components/PostLoginLandingPage/HeroCarousel.jsx";
import UpcomingEvents from "../../components/PostLoginLandingPage/UpcomingEvents.jsx";
import { PublicationCarousel} from "../../components/PostLoginLandingPage/RecommendedPublications.jsx";
import ExpertiseSection from "../../components/PostLoginLandingPage/ExpertiseSection.jsx";
import PracticeHighlightsSection from "../../components/PostLoginLandingPage/PracticeHighlightsSection.jsx";
import axiosInstance from "../../config/apiConfig.js";
import DataProvider from "../../context/DataProvider.jsx";
import { useContext } from "react";
import Footer from "../../components/Footer.jsx";

// ─── Fallback Slides ──────────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
  {
    _id:      'fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80',
    category: 'Publication',
    title:    'AI in Healthcare is Reshaping Clinical Decision Making Across the Globe',
    link:     '/publications',
  },
  {
    _id:      'fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80',
    category: 'Event',
    title:    'The Future of Renewable Energy is Driving the Next Industrial Revolution',
    link:     '/events',
  },
];

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const FALLBACK_PUBLICATIONS = [
  {
    _id: "fallback-1",
    title: "AI in Physical Form: The Rise of Robots and Humanoids",
    publishingDate: "2025-12-19T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Sandy Carter" }, { name: "Dr. Priyanka Shrivastava" }, { name: "Sanjeev Sharma" }],
    tags: ["Human-Machine Systems", "Embodied Intelligence", "Adaptive Automation"],
    // AI / robotics
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  },
  {
    _id: "fallback-2",
    title: "Perspectives: Why Is Blockchain Not Successful (Yet)?",
    publishingDate: "2025-12-10T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Dr. Nikhil Varma" }],
    tags: ["Blockchain Taxonomy", "Digital Infrastructure", "Innovation Ecosystems"],
    // Circuit / digital tech
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    _id: "fallback-3",
    title: "AI Trust Revolution: Economic Incentives and Distributed Verification Solve Supply Chain Transparency",
    publishingDate: "2025-12-22T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Dr. Alejandro Molina" }],
    tags: ["Supply Chain", "Artificial Intelligence", "Transparency"],
    // Warehouse / logistics
    thumbnailUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  },
  {
    _id: "fallback-4",
    title: "Addressing Challenges and Delivering Value in Healthcare Using Generative AI",
    publishingDate: "2025-11-30T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Shree Varuna Ramesh" }, { name: "Shannon Kennedy" }],
    tags: ["Data Governance", "Healthcare Compliance", "SLM for Health Innovation"],
    // Medical lab
    thumbnailUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80",
  },
  {
    _id: "fallback-5",
    title: "A New Prescription for Healthcare: Why Systemic Collaboration Is the Cure",
    publishingDate: "2026-01-08T00:00:00.000Z",
    documentType: "Policy Paper",
    Authors: [{ name: "Dr. Priyanka Shrivastava" }],
    tags: ["AI in Healthcare", "Systemic Reform", "Policy"],
    // Data / policy analytics
    thumbnailUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
  },
];

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const FALLBACK_EVENTS = [
  {
    _id:         'fallback-event-1',
    title:       'The Future of AI Governance in a Multipolar World',
    type:        'Roundtable',
    workgroup:   [{ title: 'Applied Artificial Intelligence' }],
    startDate:   '2026-05-10T11:00:00',
    endDate:     '2026-05-10T13:00:00',
    isVirtual:   true,
    location:    null,
    registerUrl: '#',
    imageUrl:    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
  },
  {
    _id:         'fallback-event-2',
    title:       'Sustainability in Tech: Driving the Next Industrial Revolution',
    type:        'Roundtable',
    workgroup:   [{ title: 'Sustainability in Tech' }],
    startDate:   '2026-07-17T11:00:00',
    endDate:     '2026-07-17T13:00:00',
    isVirtual:   true,
    location:    null,
    registerUrl: '#',
    imageUrl:    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1920&q=80',
  },
  {
    _id:         'fallback-event-3',
    title:       'Digital Economy Summit: Redefining Global Trade in 2027',
    type:        'Summit',
    workgroup:   [{ title: 'Davos 2027' }],
    startDate:   '2027-01-10T09:00:00',
    endDate:     '2027-01-16T18:00:00',
    isVirtual:   false,
    location:    'Davos, Switzerland',
    registerUrl: '#',
    imageUrl:    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
  },
];


const PostLoginLandingPage = () =>{

      const [heroSlides, setHeroSlides]= useState(FALLBACK_SLIDES);
      const [upcomingEvents, setUpcomingEvents] = useState(FALLBACK_EVENTS);
      const [publications, setPublications]= useState(FALLBACK_PUBLICATIONS);
      const [workgroupData, setWorkgroupData] = useState();
      const [loading, setLoading]= useState(false);
      const {account} = useContext(DataProvider.DataContext);

      const processWorkgroupData = (data) => {
        const { workgroup, events = [], publications = [] } = data;

        const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

        // Wrap with type
        const eventItems = events.map(e => ({ type: "event", data: e }));
        const publicationItems = publications.map(p => ({ type: "publication", data: p }));

        // Combine all 4
        const combined = [...eventItems, ...publicationItems];

        // Shuffle mixed order
        const shuffledItems = shuffle(combined);

        return {
            workgroup,
            items: shuffledItems
        };
    };

      useEffect(() => {
        const fetchHighlights = async () => {
          try {
            setLoading(true);
            const res = await axiosInstance.get('/api/user/highlights/personalized');
            console.log("Response of personalized data --->", res.data);
            const heroSlideContent = [
                res?.data?.upcomingEvents?.[0], 
                res?.data?.publications?.[0]
            ].filter(Boolean);

            setHeroSlides(heroSlideContent);
            const upcomingEvents = res?.data?.upcomingEvents;
            const publications   = res?.data?.publications;

            setUpcomingEvents(upcomingEvents ?? FALLBACK_EVENTS);
            setPublications(publications ?? FALLBACK_PUBLICATIONS);

          } catch (err) {
            console.error('Failed to fetch highlights, using fallback:', err);
          } finally {
            setLoading(false);
          }
        };

        const fetchWorkgroup = async() =>{
            try{
                setLoading(true);
                const response = await axiosInstance.get("/api/user/highlights/workgroup");
                const processedData = processWorkgroupData(response.data);

                console.log("processed data-->", processedData);

                setWorkgroupData(processedData);
            }catch(err){
                console.log("This error is occurring while trying to fetch personalized workgroup data-->", err);
            }finally{
                setLoading(false);
            }
        }
        fetchHighlights();
        fetchWorkgroup();
      }, []);


    return(
        <>
            <HeroCarousel onHamburgerClick={()=> console.log("Click")} slideContent={heroSlides}/>
            <UpcomingEvents eventsContent={upcomingEvents}/>
            <PublicationCarousel publicationContent={publications}/>
            <ExpertiseSection/>
            <PracticeHighlightsSection workgroup={workgroupData?.workgroup} data={workgroupData}/>
            <Footer/>
        </>
    )
}

export default PostLoginLandingPage;