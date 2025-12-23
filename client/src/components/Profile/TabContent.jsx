import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import FellowshipRegistrationCard from "./FellowshipRegistrationCard";
import PastRegistrationsTable from "./PastRegistrationsTable";
import RegistrationPrompt from "./RegistrationPrompt";
import ProfileSettings from "./ProfileSettings";
import Memberships from "./Memberships";
import ApplicationTracker from "./ApplicationTracker";
import OnboardingStatusBanner from "./OnboardingStatusBanner";
import axiosInstance from "../../config/apiConfig";
import DataProvider from "../../context/DataProvider";

const updateUserData = async () => {
  try {
    //const response = await axiosInstance.get(`/api/user/get/${account._id}`);
    console.log("Changing user data....");
    // Update state with fetched user data
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const TabContent = ({account ,activeTab, currentRegistrations, pastRegistrations }) => {
  const { account: contextAccount } = useContext(DataProvider.DataContext);
  const [fellowProfile, setFellowProfile] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [pendingOnboardingRegistration, setPendingOnboardingRegistration] = useState(null);

  // Fetch fellow profile based on userId
  useEffect(() => {
    if (activeTab === 'current' && currentRegistrations?.length > 0 && contextAccount?._id) {
      const fetchProfileStatus = async () => {
        setLoadingProfiles(true);
        let firstPendingReg = null;
        
        try {
          const response = await axiosInstance.get(`/api/fellow-profile/getFellowProfile/${account._id}`);
          const profile = response.data.profile;
          setFellowProfile(profile);
          
          // Track the first registration with the fetched profile
          if (profile?.status !== 'APPROVED') {
            firstPendingReg = {
              registration: currentRegistrations[0],
              profile: profile
            };
          }
        } catch (error) {
          console.error(`Error fetching profile for user ${contextAccount._id}:`, error);
          setFellowProfile(null);
          
          // If error or no profile, use the first registration as pending
          firstPendingReg = {
            registration: currentRegistrations[0],
            profile: null
          };
        } finally {
          setPendingOnboardingRegistration(firstPendingReg);
          setLoadingProfiles(false);
        }
      };

      fetchProfileStatus();
    }
  }, [activeTab, currentRegistrations, contextAccount?._id]);

  if (activeTab === 'current') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Fellowship Registrations</h2>
          <p className="text-gray-600">Manage your active fellowship registrations and workgroup assignments.</p>
        </div>

        {/* Show onboarding banner only once for the first registration without approved profile */}
        {pendingOnboardingRegistration && (
          <OnboardingStatusBanner 
            registration={pendingOnboardingRegistration.registration}
            fellowProfile={pendingOnboardingRegistration.profile}
          />
        )}

        {currentRegistrations?.length > 0 ? (
          <div className="grid gap-6">
            {currentRegistrations?.map((registration) => (
              <FellowshipRegistrationCard key={registration._id} registration={registration} />
            ))}
          </div>
        ) : (
          <RegistrationPrompt />
        )}
      </div>
    );
  }else if(activeTab === 'settings') {
    return (
      <div>
        <ProfileSettings 
          user={account} 
          onUpdateSuccess={updateUserData}
        />
      </div>
    );
  }else if(activeTab === 'membership'){
    return (
      <div>
        <Memberships/> 
      </div>
    )
  }else if(activeTab === 'track-application'){
    return(
      <div><ApplicationTracker/></div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fellowship History</h2>
        <p className="text-gray-600">Review your completed fellowship registrations, workgroups, and research contributions.</p>
      </div>
      
      <PastRegistrationsTable registrations={pastRegistrations} />
    </div>
  );
};

export default TabContent;