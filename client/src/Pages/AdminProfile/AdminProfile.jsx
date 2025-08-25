import React, { useState, useEffect, useContext } from 'react';
import { 
  BarChart3, 
  Award, 
  Users, 
  FileText, 
  Plus,
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  History,
  Target,
  Globe,
  Wrench
} from 'lucide-react';
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


// Sample data
const sampleAdminData = {
  user: {
    _id: "admin123",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@thinktank.org",
    role: "ADMIN",
    profilePicture: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=150&h=150&fit=crop&crop=face"
  },
  stats: {
    totalFellowships: 12,
    activeFellowships: 5,
    totalApplications: 247,
    pendingApplications: 18,
    acceptedApplications: 156,
    rejectedApplications: 73,
    totalRevenue: 12350,
    totalUsers: 423
  },
  pendingApplications: [
    {
      _id: "app1",
      applicant: {
        name: "John Smith",
        email: "john.smith@example.com",
        organization: "Global Research Institute",
        position: "Senior Researcher",
        experience: "5-10",
        linkedin: "https://linkedin.com/in/johnsmith"
      },
      fellowship: {
        _id: "fellowship1",
        title: "Climate Policy Initiative",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg1",
        name: "Environmental Policy Research"
      },
      motivation: "I am passionate about environmental policy and have extensive experience in climate research...",
      status: "PENDING",
      submittedAt: "2024-08-10T14:30:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test123"
    },
    {
      _id: "app2",
      applicant: {
        name: "Maria Garcia",
        email: "maria.garcia@university.edu",
        organization: "Academic Research Center",
        position: "Research Director",
        experience: "10-15",
        linkedin: "https://linkedin.com/in/mariagarcia"
      },
      fellowship: {
        _id: "fellowship2",
        title: "Global Policy Fellowship",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg2",
        name: "Economic Development Research"
      },
      motivation: "My background in economic development aligns perfectly with this fellowship's objectives...",
      status: "PENDING",
      submittedAt: "2024-08-09T10:15:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test456"
    },
    {
      _id: "app3",
      applicant: {
        name: "David Chen",
        email: "david.chen@techcorp.com",
        organization: "Technology Solutions Inc",
        position: "Innovation Director",
        experience: "8-12",
        linkedin: "https://linkedin.com/in/davidchen"
      },
      fellowship: {
        _id: "fellowship3",
        title: "Digital Transformation Fellowship",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg3",
        name: "Technology Innovation Lab"
      },
      motivation: "With my extensive background in digital transformation and innovation management...",
      status: "ACCEPTED",
      submittedAt: "2024-08-08T09:20:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test789"
    }
  ],
  pastFellowships: [
    {
      _id: "fellowship_past1",
      title: "International Relations Fellowship",
      description: "Comprehensive program on diplomatic relations and foreign policy",
      cycle: "2023-Fall",
      status: "COMPLETED",
      participantsCount: 18,
      completedAt: "2024-02-28T00:00:00Z"
    },
    {
      _id: "fellowship_past2",
      title: "Digital Governance Initiative",
      description: "Research program on digital policy and governance frameworks",
      cycle: "2023-Spring",
      status: "COMPLETED",
      participantsCount: 15,
      completedAt: "2023-08-15T00:00:00Z"
    }
  ]
};


const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState(sampleAdminData);
  const [pastFellowships, setPastFellowships] = useState([]);
  const [loading, setLoading] = useState(true);
  const {account} = useContext(DataProvider.DataContext);
  const [participantCount, setParticipantCount] = useState({});
  const [fellowshipRegistrations, setFellowshipRegistrations] = useState({});
  const [adminStats, setAdminStats] = useState({});

  

  /* Fetching stats for admin */
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axiosInstance.get("/api/user/stats");
        console.log("Fetched admin stats:", response.data);
        setAdminStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchAdminStats();
  }, []);


  /* Use effect for fetching past fellowships */
  useEffect(()=>{
    const fetchPastFellowships = async () => {
      try {
        const response = await axiosInstance.get("/api/fellowship/getAllPastFellowships");
        console.log("Fetched past fellowships:", response.data.fellowships);
        setPastFellowships(response.data.fellowships || []);
      } catch (error) {
        console.error('Error fetching past fellowships:', error);
      }
    };

    fetchPastFellowships();
  }, []);

  /* Use effect for fetching fellowship registration counts */
  useEffect(() => {
    const fetchRegistrationCounts = async () => {
      try {
        const response = await axiosInstance.get("/api/fellowship/registrationCounts");
        console.log("Fetched registration counts:", response.data);
        const counts = response.data.registrationCounts || {};
        console.log("Setting participant counts to:", counts);
        setParticipantCount(counts);
      } catch (error) {
        console.error('Error fetching registration counts:', error);
        toast.error('Failed to fetch registration counts');
      }
    };

    fetchRegistrationCounts();
  }, []);

  /* useffect to fetch registrations */
  useEffect(()=>{
    const fetchFellowshipRegistrations = async () => {
      try {
        const response = await axiosInstance.get("/api/fellowship-registration/getFellowshipsNeedingReview");
        console.log("Fetched fellowship registrations for all users:", response.data.registrations);
        setFellowshipRegistrations(response.data.registrations || []);
      } catch (error) {
        console.error('Error fetching fellowship registrations:', error);
      }
    };
    fetchFellowshipRegistrations();
  },[])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAdminData(sampleAdminData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      console.log(`Updating application ${applicationId} to ${newStatus}`);
      const response = await axiosInstance.post(`/api/fellowship-registration/${newStatus.toLowerCase()}FellowshipRegistration/${applicationId}`);
      setFellowshipRegistrations(prev => {
        const updatedRegistrations = prev.map(registration => {
          if (registration._id === applicationId) {
            return { ...registration, status: newStatus };
          }
          return registration;
        });
        return updatedRegistrations;
      });

      alert(`Application ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const handleCreateFellowship = async (fellowshipData) => {
    try {
      console.log('Creating fellowship:', fellowshipData);
      const result = await axiosInstance.post("/api/fellowship/addNewFellowship", fellowshipData);
      console.log(result);
      toast.success('Fellowship created successfully!');
    } catch (error) {
      console.error('Error creating fellowship:', error);
      alert('Error creating fellowship');
    }
  };

  const handleCreateWorkgroup = async (workgroupData) => {
    try {
      console.log('Creating workgroup:', workgroupData);
      const result = await axiosInstance.post("/api/fellowship/addNewWorkgroup", workgroupData);
      toast.success('Workgroup created successfully!');
      console.log("This is the result after adding new workgroup--->", result);
      
    } catch (error) {
      console.error('Error creating workgroup:', error?.response?.msg);
      toast.error(error?.response?.data?.msg);
    }
  };

  // New handlers for additional tabs
  const handleFutureFellowshipEdit = (fellowship) => {
    console.log('Edit future fellowship:', fellowship);
    // Navigate to edit form or open modal
  };

  const handleFutureFellowshipDelete = (fellowshipId) => {
    console.log('Delete future fellowship:', fellowshipId);
    // API call to delete fellowship
  };

  const handleFutureFellowshipView = (fellowship) => {
    console.log('View future fellowship details:', fellowship);
    // Open detailed view modal
  };

  const handleProfileUpdate = (profileData) => {
    console.log('Update admin profile:', profileData);
    // Update admin profile via API
  };

  const handleWebsiteDelete = () => {
    console.log('Delete website requested');
    // Handle website deletion
  };

  const handleWorkgroupEdit = (workgroupId, workgroupData) => {
    console.log('Edit workgroup:', workgroupId, workgroupData);
    // Update workgroup via API
  };

  const handleWorkgroupDelete = (workgroupId) => {
    console.log('Delete workgroup:', workgroupId);
    // Delete workgroup via API
  };

  const handleWorkgroupCreate = () => {
    setActiveTab('workgroups'); // Navigate to create workgroup tab
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fellowships', label: 'Add Fellowship', icon: Award },
    { id: 'workgroups', label: 'Add Workgroup', icon: Target },
    { id: 'moderation', label: 'Moderate Applications', icon: FileText },
    { id: 'future', label: 'Future Fellowships', icon: Calendar },
    { id: 'history', label: 'Past Fellowships', icon: History },
    { id: 'manage-workgroups', label: 'Manage Workgroups', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

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
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage fellowships, applications, and system settings</p>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{account.name}</p>
                <p className="text-xs text-gray-500">{account.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={adminData.user.profilePicture} 
                  alt={adminData.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

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

          {activeTab === 'settings' && (
            <AdminSettings
              user={account}
              onUpdateAccess={handleProfileUpdate}
            />
          )}
        </main>
      </div>

      {/* Admin Info Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex-shrink-0">
        <div className="text-center mb-6">
          <img
            src={adminData.user.profilePicture}
            alt={adminData.user.name}
            className="w-20 h-20 rounded-full mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
          <p className="text-sm text-gray-600">{account.email}</p>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
            {account.role}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Reviews</span>
                <span className="font-medium text-orange-600">{adminStats.pendingApplications?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Fellowships</span>
                <span className="font-medium text-green-600">{adminStats.activeFellowships || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">{adminStats.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month Revenue</span>
                <span className="font-medium text-blue-600">${Math.round((adminStats.monthlyRevenue || 0) / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>3 new applications submitted today</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>2 applications approved yesterday</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>1 fellowship cycle started this week</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span>New workgroup created last week</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Health</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Server Status</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Gateway</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email Service</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Running
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;