import React, { useState, useEffect, useContext } from 'react';
import {toast} from "react-toastify";

import AddFellowshipForm from "../../components/AdminProfile/AddFellowshipForm.jsx";
import AddWorkgroupForm from "../../components/AdminProfile/AddWorkgroupForm.jsx";
import ApplicationsModeration from "../../components/AdminProfile/ApplicationModeration.jsx";
import DashboardOverview from "../../components/AdminProfile/DashboardOverview.jsx";
import PastFellowships from "../../components/AdminProfile/PastFellowships.jsx";
import FutureFellowships from "../../components/AdminProfile/FutureFellowships.jsx";
import AdminSettings from "../../components/AdminProfile/AdminSettings.jsx";
import ManageWorkgroups from "../../components/AdminProfile/ManageWorkgroups.jsx";
import DataProvider from '../../context/DataProvider.jsx';
import axiosInstance from '../../config/apiConfig.js';
import AdminOnboardingTab from '../../components/AdminProfile/AdminOnboardingTab.jsx';
import UserVerificationTab from '../../components/AdminProfile/UserVerificationTab/UserVerificationTab.jsx';

import { sampleAdminData, tabs } from '../../components/AdminProfile/Utils/adminConstants.js';
import {useAdminData} from '../../components/AdminProfile/Hooks/useAdminData.js';
import {useAdminActions} from '../../components/AdminProfile/Hooks/useAdminActions.js';

import AdminHeader from '../../components/AdminProfile/AdminHeader.jsx';
import AdminInfoSideBar from '../../components/AdminProfile/AdminInfoSideBar.jsx';


const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState();
  const [is2FAenabled, setIs2FAenabled] = useState(false);
  const {account} = useContext(DataProvider.DataContext);

  const {
    adminStats,
    pastFellowships,
    participantCount,
    fellowshipRegistrations,
    setFellowshipRegistrations,
    loading,
    setLoading
  } = useAdminData();
  

  /* Fetching stats for admin */
  const {
    handleStatusChange,
    handleCreateFellowship,
    handleCreateWorkgroup,
    handleFutureFellowshipEdit,
    handleFutureFellowshipDelete,
    handleFutureFellowshipView,
    handleProfileUpdate,
    handleWorkgroupEdit,
    handleWorkgroupDelete,
  } = useAdminActions(setFellowshipRegistrations);

 useEffect(() => {
   console.log("useEffect triggered, account:", account);
   console.log("account._id:", account?._id);
   console.log(is2FAenabled);
   
   const fetchUser = async () => {
     try {
       if (!account?._id) {
         console.log("Early return - no account ID");
         return;
       }
       
       console.log("Fetching 2FA details...");
       const response = await axiosInstance.get(`/api/user/get2FADetails/${account._id}`);
       console.log("2FA response:", response.data);
       setIs2FAenabled(response?.data?.user?.isMFAenabled);
     } catch(err) {
       console.log("This error is occurring while trying to fetch the user-->", err);
     }
   }
 
   fetchUser();
 }, []);

  const handleWorkgroupCreate = () => {
    setActiveTab('workgroups'); // Navigate to create workgroup tab
  };  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader account={account} adminData={adminData} is2FAenabled={is2FAenabled}/>

        {/* Navigation Tabs - Fixed scrollable container */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-8">
            <nav className="flex overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                nav::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto min-h-0">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              stats={adminStats}
              recentApplications={adminStats.pendingApplications}
              onStatusChange={handleStatusChange}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'fellowships' && (
            <AddFellowshipForm
              onSubmit={handleCreateFellowship}
              onCancel={() => {}}
            />
          )}

          {activeTab === 'workgroups' && (
            <AddWorkgroupForm
              onSubmit={handleCreateWorkgroup}
              onCancel={() => {}}
            />
          )}

          {activeTab === 'moderation' && (
            <ApplicationsModeration
              applications={fellowshipRegistrations}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'future' && (
            <FutureFellowships
              onEdit={handleFutureFellowshipEdit}
              onDelete={handleFutureFellowshipDelete}
              onViewDetails={handleFutureFellowshipView}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'history' && (
            <PastFellowships fellowships={pastFellowships} participantsCount={participantCount} />
          )}

          {activeTab === 'manage-workgroups' && (
            <ManageWorkgroups
              onEdit={handleWorkgroupEdit}
              onDelete={handleWorkgroupDelete}
              onCreate={handleWorkgroupCreate}
            />
          )}

          {activeTab === 'onboarding' && (
            <AdminOnboardingTab  />
          )}

          
          {activeTab === 'user-verification' && (
            <UserVerificationTab/>
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              user={account}
              onUpdateAccess={handleProfileUpdate}
            />
          )}
        </main>
      </div>

      {/* Admin Info Sidebar */}
      <AdminInfoSideBar adminData={adminData} adminStats={adminStats} account={account} />
    </div>
  );
};

export default AdminProfile;