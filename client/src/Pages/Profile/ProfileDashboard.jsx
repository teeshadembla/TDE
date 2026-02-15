import React, { useState, useEffect } from 'react';
import { User, Award, Clock, Settings, IdCard, ClipboardList, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TabContent from '../../components/Profile/TabContent.jsx';
import ProfileSidebar from '../../components/Profile/ProfileSidebar.jsx';
import ProfileSettings from '../../components/Profile/ProfileSettings.jsx';
import DataProvider from '../../context/DataProvider.jsx';
import { useContext } from 'react';
import axiosInstance from '../../config/apiConfig.js';



const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentRegistrations, setCurrentRegistrations] = useState([]);
  const [pastRegistrations, setPastRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [is2FAenabled, setIs2FAenabled] = useState(false);
  const { account } = useContext(DataProvider.DataContext);
  const navigate = useNavigate();


useEffect(() => {
  console.log("useEffect triggered, account:", account);
  console.log("account._id:", account?._id);
  
  const fetchUser = async () => {
    try {
      if (!account?._id) {
        console.log("Early return - no account ID");
        return;
      }
      
      console.log("Fetching 2FA details...");
      const response = await axiosInstance.get(`/api/user/get2FADetails/${account._id}`);
      console.log("2FA response:", response.data.user.isMFAenabled);
      setIs2FAenabled(response?.data?.user?.isMFAenabled);
    } catch(err) {
      console.log("This error is occurring while trying to fetch the user-->", err);
    }
  }

  fetchUser();
}, []);


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
    {id:'track-application' , label: "Application Tracker", icon: ClipboardList},
    {id: 'membership', label: "Manage Membership" ,icon: IdCard}
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
              {!is2FAenabled && <button
                onClick={() => navigate('/setup-2fa')}
                className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #004aad 0%, #062c65 100%)'
                }}
              >
                <Lock className="w-4 h-4" />
                <span>Setup 2FA</span>
              </button>}
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