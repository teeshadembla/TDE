import FellowshipRegistrationCard from "./FellowshipRegistrationCard";
import PastRegistrationsTable from "./PastRegistrationsTable";
import RegistrationPrompt from "./RegistrationPrompt";
import ProfileSettings from "./ProfileSettings";

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
  if (activeTab === 'current') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Fellowship Registrations</h2>
          <p className="text-gray-600">Manage your active fellowship registrations and workgroup assignments.</p>
        </div>
        
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