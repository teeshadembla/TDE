import React, { useState, useEffect } from 'react';
import { User,  Award, Clock, Settings, IdCard} from 'lucide-react';
import TabContent from '../../components/Profile/TabContent.jsx';
import ProfileSidebar from '../../components/Profile/ProfileSidebar.jsx';
import ProfileSettings from '../../components/Profile/ProfileSettings.jsx';
import DataProvider from '../../context/DataProvider.jsx';
import { useContext } from 'react';
import axiosInstance from '../../config/apiConfig.js';


const sampleCurrentRegistrations = [
  {
    _id: "60d0fe4f5311236168a109cb",
    fellowship: {
      _id: "60d0fe4f5311236168a109cc",
      title: "Global Policy Fellowship",
      description: "Advanced program focusing on international policy development and implementation",
      cycle: "2024-Spring",
      createdAt: "2024-01-15T00:00:00Z"
    },
    workgroup: {
      _id: "60d0fe4f5311236168a109cd",
      title: "Economic Development Research",
      description: "Analyzing sustainable economic growth strategies for emerging markets",
      researchPapers: ["60d0fe4f5311236168a109ce", "60d0fe4f5311236168a109cf"],
      slackChannelUrl: "https://thinktank-workspace.slack.com/channels/economic-development-research"
    },
    status: "ACCEPTED",
    createdAt: "2024-03-01T00:00:00Z"
  }
];


const samplePastRegistrations = [
  {
    _id: "60d0fe4f5311236168a109d0",
    fellowship: {
      _id: "60d0fe4f5311236168a109d1",
      title: "International Relations Fellowship",
      description: "Comprehensive program on diplomatic relations and foreign policy",
      cycle: "2023-Fall",
      createdAt: "2023-08-01T00:00:00Z"
    },
    workgroup: {
      _id: "60d0fe4f5311236168a109d2",
      title: "Diplomatic Studies",
      description: "Research focused on modern diplomatic practices and international law",
      researchPapers: ["60d0fe4f5311236168a109d3"],
      slackChannelUrl: "https://thinktank-workspace.slack.com/channels/diplomatic-studies"
    },
    status: "ACCEPTED",
    createdAt: "2023-09-15T00:00:00Z",
    completedAt: "2024-02-28T00:00:00Z"
  },
  {
    _id: "60d0fe4f5311236168a109d4",
    fellowship: {
      _id: "60d0fe4f5311236168a109d5",
      title: "Climate Policy Initiative",
      description: "Focused research program on environmental policy and climate change mitigation",
      cycle: "2023-Spring",
      createdAt: "2023-01-01T00:00:00Z"
    },
    workgroup: {
      _id: "60d0fe4f5311236168a109d6",
      title: "Environmental Policy Research",
      description: "Developing sustainable environmental policies for urban development",
      researchPapers: ["60d0fe4f5311236168a109d7", "60d0fe4f5311236168a109d8"],
      slackChannelUrl: "https://thinktank-workspace.slack.com/channels/environmental-policy"
    },
    status: "ACCEPTED",
    createdAt: "2023-02-20T00:00:00Z",
    completedAt: "2023-08-15T00:00:00Z"
  }
];


const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentRegistrations, setCurrentRegistrations] = useState([]);
  const [pastRegistrations, setPastRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useContext(DataProvider.DataContext);



    /* Use Effect for fetching user registrations */
    useEffect(()=>{
      const fetchUserRegistrations = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/api/fellowship-registration/getAllRegistrationsByUser/${account._id}`);
          console.log("Fetched user registrations:", response.data.registrations);
          setCurrentRegistrations(response?.data?.registrations?.current);
          setPastRegistrations(response?.data?.registrations?.past);
        } catch (error) {
          console.error('Error fetching user registrations:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserRegistrations();
    }, [account._id]);

    

  const tabs = [
    { id: 'current', label: 'Current Registrations', icon: Award },
    { id: 'history', label: 'Fellowship History', icon: Clock },
    {id: 'membership', label: "Manage Membership" ,icon: IdCard},
    { id: 'settings', label: "Profile Settings", icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Think Tank Fellowship Portal</h1>
              <p className="text-gray-600 mt-1">Manage your fellowship registrations and research contributions</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <TabContent
            account={account} 
            activeTab={activeTab} 
            currentRegistrations={currentRegistrations}
            pastRegistrations={pastRegistrations}
          />
        </main>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar 
        user={account} 
        currentRegistrations={currentRegistrations}
        pastRegistrations={pastRegistrations}
      />
    </div>
  );
};

export default ProfileDashboard;