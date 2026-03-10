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
        const response = await axiosInstance.get('/api/fellow-profile/fetchAllProfiles');
        console.log("Fellows fetched",response?.data?.fellows[0]);
        setAllFellows(response?.data?.fellows[0]);
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
  if (!allFellows) {
    return {
      chairs: [],
      seniorExecutiveFellows: [],
      fellows: []
    };
  }

  const filterAndSort = (arr = []) =>
    arr
      .filter((fellow) => {
        const matchesWorkgroup =
          selectedWorkgroup === "" ||
          String(fellow.workGroupId) === String(selectedWorkgroup);

        if (!matchesWorkgroup) return false;

        if (searchTerm === "") return true;

        const searchLower = searchTerm.toLowerCase();

        return (
          fellow.displayName?.toLowerCase().includes(searchLower) ||
          fellow.headline?.toLowerCase().includes(searchLower) ||
          fellow.company?.toLowerCase().includes(searchLower) ||
          fellow.location?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) =>
        (a.displayName || "").localeCompare(b.displayName || "", undefined, {
          sensitivity: "base"
        })
      );

  return {
    chairs: filterAndSort(allFellows.chairs),
    seniorExecutiveFellows: filterAndSort(
      allFellows.seniorExecutiveFellows
    ),
    fellows: filterAndSort(allFellows.fellows)
  };
}, [allFellows, searchTerm, selectedWorkgroup]);

const totalCount =
  (filteredFellows.chairs?.length || 0) +
  (filteredFellows.seniorExecutiveFellows?.length || 0) +
  (filteredFellows.fellows?.length || 0);
  
  
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
            

  Showing {totalCount} people
          </p>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading fellows...</p>
          </div>
        )}
        
        {/* Content */}
{!loading && (
  <>
    {/* Chairs */}
    {filteredFellows.chairs?.length > 0 && (
      <>
        <h2 className="text-white text-xl font-semibold mb-4">Chairs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filteredFellows.chairs.map((fellow) => (
            <PersonCard
              key={fellow._id}
              id={fellow._id}
              name={fellow.displayName}
              title={fellow.headline}
              imageUrl={fellow.professionalHeadshotUrl}
            />
          ))}
        </div>
      </>
    )}

    {/* Senior Executive Fellows */}
    {filteredFellows.seniorExecutiveFellows?.length > 0 && (
      <>
        <h2 className="text-white text-xl font-semibold mb-4">
          Senior Executive Fellows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filteredFellows.seniorExecutiveFellows.map((fellow) => (
            <PersonCard
              key={fellow._id}
              id={fellow._id}
              name={fellow.displayName}
              title={fellow.headline}
              imageUrl = {fellow.professionalHeadshotUrl}
            />
          ))}
        </div>
      </>
    )}

    {/* Fellows */}
    {filteredFellows.fellows?.length > 0 && (
      <>
        <h2 className="text-white text-xl font-semibold mb-4">
          Fellows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFellows.fellows.map((fellow) => (
            <PersonCard
              key={fellow._id}
              id={fellow._id}
              name={fellow.displayName}
              title={fellow.headline}
              imageUrl = {fellow.professionalHeadshotUrl}
            />
          ))}
        </div>
      </>
    )}
  </>
)}
        
        {/* No Results Message */}
        {!loading && (
          (totalCount === 0)) && (
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
        
        
      </div>
    </div>
  );
};

export default OurPeople;