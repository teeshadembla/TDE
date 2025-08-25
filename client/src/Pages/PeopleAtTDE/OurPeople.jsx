import { useState, useMemo, useEffect } from 'react';
import { Users, Award } from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import UserProfile from '../../components/PeopleAtTDE/UserProfile.jsx';
import PersonCard from '../../components/PeopleAtTDE/PersonCard.jsx';
import SearchBar from '../../components/PeopleAtTDE/SearchBar.jsx';
import FellowshipDropdown from '../../components/PeopleAtTDE/FellowshipDropdown.jsx';

// Mock data - replace with your actual data
/* const coreTeam = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    position: "Chief Economist",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    location: "New York, NY",
    joinDate: "2020",
    publications: 12,
    bio: "Leading expert in digital transformation and economic policy with 15+ years of experience."
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    position: "Research Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    location: "London, UK",
    joinDate: "2019",
    publications: 18,
    bio: "Pioneering research in behavioral economics and digital markets."
  },
  {
    id: 3,
    name: "Dr. Aisha Patel",
    position: "Head of Analytics",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    location: "Singapore",
    joinDate: "2021",
    publications: 8,
    bio: "Expert in econometrics and data science applications in economic research."
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    position: "Senior Economist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    location: "Toronto, CA",
    joinDate: "2022",
    publications: 6,
    bio: "Specializing in monetary policy and cryptocurrency economics."
  }
]; */


const fellowsData = {
  "2024": [
    {
      id: 5,
      name: "Emma Johnson",
      position: "Research Fellow",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
      location: "Boston, MA",
      fellowship: "2024",
      publications: 3,
      specialization: "Digital Markets"
    },
    {
      id: 6,
      name: "David Kim",
      position: "Policy Fellow",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      location: "Seoul, KR",
      fellowship: "2024",
      publications: 2,
      specialization: "Fintech Policy"
    },
    {
      id: 7,
      name: "Lisa Zhang",
      position: "Data Fellow",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      location: "San Francisco, CA",
      fellowship: "2024",
      publications: 4,
      specialization: "AI Economics"
    }
  ],
  "2023": [
    {
      id: 8,
      name: "Carlos Martinez",
      position: "Research Fellow",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      location: "Madrid, ES",
      fellowship: "2023",
      publications: 5,
      specialization: "Digital Banking"
    },
    {
      id: 9,
      name: "Priya Sharma",
      position: "Policy Fellow",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      location: "Mumbai, IN",
      fellowship: "2023",
      publications: 3,
      specialization: "Digital Inclusion"
    }
  ]
};

// Main Component
const OurPeople = () => {
  const [activeTab, setActiveTab] = useState('core');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [coreTeam, setCoreTeam] = useState([]);
  const [fellowsData, setFellowsData] = useState([]);
  const [fellowshipYears, setFellowshipYears] = useState([]);

  /* Fetch Core team data */
  useEffect(()=>{
    const fetchCoreTeamMembers = async () => {
      try {
        const response = await axiosInstance.get('/api/user/core-team');
        console.log(response);
        setCoreTeam(response.data.coreTeamMembers);
      } catch (error) {
        console.error("Error fetching core team members:", error);
      }
    };

    fetchCoreTeamMembers();
  },[])

  useEffect(() => {
    const fetchFellows = async () => {
      try {
        const response = await axiosInstance.get('/api/user/fellows');
        setFellowsData(response.data.fellows);
        
        // Extract unique years from fellows data
        const years = [...new Set(
          response.data.fellows.flatMap(fellow => 
            fellow.yearlyFellowships.map(yf => yf.year)
          )
        )].sort((a, b) => b - a); // Sort years in descending order
        
        setFellowshipYears(years);
        // Set the most recent year as default
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching fellows:", error);
      }
    };

    fetchFellows();
  }, []);

  // Filter people based on search term
  const filteredCoreTeam = useMemo(() => {
    return coreTeam.filter(person =>
      searchTerm === '' ? person :
      person?.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coreTeam, searchTerm]);

  const filteredFellows = useMemo(() => {
    if (!fellowsData || !Array.isArray(fellowsData)) return [];
    
    return fellowsData.filter(person => {
      // First check if the person has fellowships in the selected year
      const hasSelectedYearFellowship = person.yearlyFellowships.some(
        yearData => yearData.year === selectedYear
      );
      
      if (!hasSelectedYearFellowship) return false;
      
      // Then apply search filters if there's a search term
      if (searchTerm === '') return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        person.user?.FullName?.toLowerCase().includes(searchLower) ||
        person.user?.title?.toLowerCase().includes(searchLower) ||
        person.user?.expertise?.some(exp => exp.toLowerCase().includes(searchLower)) ||
        person.user?.location?.toLowerCase().includes(searchLower) ||
        person.user?.company?.toLowerCase().includes(searchLower)
      );
    });
  }, [fellowsData, searchTerm, selectedYear]);
  
  if (selectedPerson) {
    return <UserProfile user={selectedPerson} onBack={() => setSelectedPerson(null)} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-light text-center mb-4 text-gray-600">Our People</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Meet the brilliant minds behind Digital Economist's groundbreaking research and analysis
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('core')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'core'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Users size={20} className="inline mr-2" />
            Core Team
          </button>
          <button
            onClick={() => setActiveTab('fellows')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'fellows'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Award size={20} className="inline mr-2" />
            Fellows
          </button>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          {activeTab === 'fellows' && (
            <FellowshipDropdown
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              years={fellowshipYears}
            />
          )}
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTab === 'core'
            ? filteredCoreTeam.map((person) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  onClick={setSelectedPerson}
                />
              ))
            : filteredFellows.map((person) => (
                <PersonCard
                  key={person._id}
                  person={person.user}
                  onClick={setSelectedPerson}
                />
              ))
          }
        </div>
        
        {/* No Results Message */}
        {((activeTab === 'core' && filteredCoreTeam.length === 0) ||
          (activeTab === 'fellows' && filteredFellows.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No people found matching your search criteria.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-black hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-light text-black">{coreTeam.length}</div>
              <div className="text-gray-600">Core Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black">
                {Object.values(fellowsData).flat().length}
              </div>
              <div className="text-gray-600">Total Fellows</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black">
                {coreTeam.reduce((sum, person) => sum + person.publications, 0) +
                 Object.values(fellowsData).flat().reduce((sum, person) => sum + person.publications, 0)}
              </div>
              <div className="text-gray-600">Total Publications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPeople;