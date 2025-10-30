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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkgroup, setSelectedWorkgroup] = useState('');
  const [allFellows, setAllFellows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workgroups, setWorkgroups] = useState([]);

  const navigate = useNavigate();

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    navigate(`/profile/${person._id}`);
  };

  useEffect(() => {
    const printCurrWorkgroup = (()=>{
      console.log("Current workgroup selected--->",selectedWorkgroup);
      console.log("Type of selected workgroup--->", typeof selectedWorkgroup);
    })

    printCurrWorkgroup();
  },[selectedWorkgroup]);
  
  /* Fetch Workgroups data */
  useEffect(() => {
    const fetchWorkgroups = async () => {
      try{
        const response = await axiosInstance.get('/api/fellowship/getWorkgroups');
        setWorkgroups(response.data.data);
      }catch(error){
        console.error("Error fetching workgroups:", error);
      }
    }
    fetchWorkgroups();
  }, []);

  /* Fetch Fellows data */
  useEffect(() => {
    const fetchFellows = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/user/fellows');
        console.log("Fellows fetched",response)
        setAllFellows(response.data.fellows);
      } catch (error) {
        console.error("Error fetching fellows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFellows();
  }, []);


  // Filter fellows based on search term AND workgroup
  const filteredFellows = useMemo(() => {
    if (!allFellows || !Array.isArray(allFellows)) return [];
    
    return allFellows.filter(fellow => {
      console.log({
      fellowWorkgroupId: fellow.workGroupId?._id,
      selectedWorkgroup,
      isMatch: String(fellow.workGroupId?._id) === String(selectedWorkgroup)
    });
      // Filter by workgroup
      const matchesWorkgroup = selectedWorkgroup === '' || 
        String(fellow.workGroupId?._id) === String(selectedWorkgroup);
      
      if (!matchesWorkgroup) return false;
      
      // Filter by search term
      if (searchTerm === '') return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        fellow.FullName?.toLowerCase().includes(searchLower) ||
        fellow.title?.toLowerCase().includes(searchLower) ||
        fellow.expertise?.some(exp => exp.toLowerCase().includes(searchLower)) ||
        fellow.location?.toLowerCase().includes(searchLower) ||
        fellow.company?.toLowerCase().includes(searchLower) ||
        fellow.workgroup?.title?.toLowerCase().includes(searchLower)
      );
    });
  }, [allFellows, searchTerm, selectedWorkgroup]);
  
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <HeroSection />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
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
                className="w-full appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-black text-white  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Workgroups ({workgroups.length})</option>
                {workgroups.map((wg) => (
                  <option key={wg._id} value={wg._id}>
                    {wg.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Results count */}
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredFellows.length} of {allFellows.length} fellows
          </p>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading fellows...</p>
          </div>
        )}
        
        {/* Content */}
{!loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {filteredFellows.map((fellow) => (
          <PersonCard
            key={fellow._id}
            person={fellow}
            workgroup={fellow.workgroupId}
            fellowship={fellow.fellowshipId}
            onClick={() =>  navigate(`/profile/${fellow._id}`)}
          />
        ))
    }
  </div>
)}
        
        {/* No Results Message */}
        {!loading && (
          (filteredFellows.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-white text-lg">No people found matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedWorkgroup('');
              }}
              className="mt-4 text-white hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div>
              <div className="text-3xl font-light text-white">{allFellows.length}</div>
              <div className="text-gray-600">Total Fellows</div>
            </div>
            <div>
              <div className="text-3xl font-light text-white">{workgroups.length}</div>
              <div className="text-gray-600">Active Workgroups</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPeople;