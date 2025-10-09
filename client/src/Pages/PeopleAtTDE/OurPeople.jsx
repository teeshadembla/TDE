import { useState, useMemo, useEffect } from 'react';
import { Users, Award } from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import UserProfile from '../../components/PeopleAtTDE/UserProfile.jsx';
import PersonCard from '../../components/PeopleAtTDE/PersonCard.jsx';
import SearchBar from '../../components/PeopleAtTDE/SearchBar.jsx';
import HeroSection from '../../components/PeopleAtTDE/HeroSection.jsx';
import FellowshipDropdown from '../../components/PeopleAtTDE/FellowshipDropdown.jsx';
import { useNavigate } from 'react-router-dom';

// Inside your component



// Main Component
const OurPeople = () => {
  const [activeTab, setActiveTab] = useState('core');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkgroup, setSelectedWorkgroup] = useState('all');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [coreTeam, setCoreTeam] = useState([]);
  const [allFellows, setAllFellows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workgroups, setWorkgroups] = useState([]);

  const navigate = useNavigate();

const handlePersonClick = (person) => {
  setSelectedPerson(person);
  navigate(`/profile/${person._id}`);
};
  
  /* Fetch Workgroups data */
  useEffect(() => {
    const fetchWorkgroups = async () => {
      try{
        const response = await axiosInstance.get('/api/fellowship/getWorkgroups');
        console.log(response);
        setWorkgroups(response.data.data);
      }catch(error){
        console.error("Error fetching workgroups:", error);
      }
    }
    fetchWorkgroups();
  }, []);

  /* Fetch Core team data */
  useEffect(() => {
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
  }, []);

  /* Fetch Fellows data */
  useEffect(() => {
    const fetchFellows = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/user/fellows');
        setAllFellows(response.data.fellows);
      } catch (error) {
        console.error("Error fetching fellows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFellows();
  }, []);


  // Filter core team based on search term
  const filteredCoreTeam = useMemo(() => {
    return coreTeam.filter(person =>
      searchTerm === '' ? true :
      person?.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coreTeam, searchTerm]);

  // Filter fellows based on search term AND workgroup
  const filteredFellows = useMemo(() => {
    if (!allFellows || !Array.isArray(allFellows)) return [];
    
    return allFellows.filter(fellow => {
      // Filter by workgroup
      const matchesWorkgroup = selectedWorkgroup === 'all' || 
        fellow.workgroup?._id === selectedWorkgroup;
      
      if (!matchesWorkgroup) return false;
      
      // Filter by search term
      if (searchTerm === '') return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        fellow.user?.FullName?.toLowerCase().includes(searchLower) ||
        fellow.user?.title?.toLowerCase().includes(searchLower) ||
        fellow.user?.expertise?.some(exp => exp.toLowerCase().includes(searchLower)) ||
        fellow.user?.location?.toLowerCase().includes(searchLower) ||
        fellow.user?.company?.toLowerCase().includes(searchLower) ||
        fellow.workgroup?.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [allFellows, searchTerm, selectedWorkgroup]);
  
  if (selectedPerson) {
    return <UserProfile user={selectedPerson} onBack={() => setSelectedPerson(null)} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeroSection />
      
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
            <div className="w-full max-w-xs">
          <label
            htmlFor="workgroup"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
          </label>
          <div className="relative">
            <select
              id="workgroup"
              value={selectedWorkgroup}
              onChange={(e) => setSelectedWorkgroup(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Workgroups ({allFellows.length})</option>
              {workgroups.map((wg) => (
                <option key={wg._id} value={wg._id}>
                  {wg.title}
                </option>
              ))}
            </select>
          </div>
        </div>

          )}
        </div>

        {/* Results count */}
        {activeTab === 'fellows' && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredFellows.length} of {allFellows.length} fellows
          </p>
        )}
        
        {/* Loading State */}
        {loading && activeTab === 'fellows' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading fellows...</p>
          </div>
        )}
        
        {/* Content */}
{!loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {activeTab === 'core'
      ? filteredCoreTeam.map((person) => (
          <PersonCard
            key={person._id}
            person={person}
            onClick={() => handlePersonClick(person)}
          />
        ))
      : filteredFellows.map((fellow) => (
          <PersonCard
            key={fellow._id}
            person={fellow}
            workgroup={fellow.workgroupId}
            fellowship={fellow.fellowshipId}
            onClick={() =>  handlePersonClick(fellow)}
          />
        ))
    }
  </div>
)}
        
        {/* No Results Message */}
        {!loading && ((activeTab === 'core' && filteredCoreTeam.length === 0) ||
          (activeTab === 'fellows' && filteredFellows.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No people found matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedWorkgroup('all');
              }}
              className="mt-4 text-black hover:underline"
            >
              Clear filters
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
              <div className="text-3xl font-light text-black">{allFellows.length}</div>
              <div className="text-gray-600">Total Fellows</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black">{workgroups.length}</div>
              <div className="text-gray-600">Active Workgroups</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPeople;