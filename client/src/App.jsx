// File: src/App.jsx
import './App.css';
import HomePage from './Pages/HomePage.jsx'; 
import Header from './components/Header.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Pages/Auth/Login.jsx';
import { Signature } from 'lucide-react';
import Signup from './Pages/Auth/Signup.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataProvider from "./context/DataProvider.jsx";
import { HeaderCollapseProvider, HeaderCollapseContext } from "./context/HeaderCollapseContext.jsx";
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from './config/apiConfig.js';
import EventsDashboard from './Pages/Events/EventsDashboard.jsx';
import ProfileDashboard from "./Pages/Profile/ProfileDashboard.jsx";
import ExecutiveFellowship from './Pages/ExecutiveFellowship.jsx';
import CenterForExcellence from './Pages/CentreForExcellence.jsx';
import ApplicationModal from "./components/ExecutiveFellowships/ApplicationModal.jsx";
import CommunityPage from './Pages/CommunityPage/CommunityPage.jsx';
import OurPeople from  "./Pages/PeopleAtTDE/OurPeople.jsx";
import AboutUs from './Pages/AboutUs/AboutUs.jsx';
import { useAuth, useUser } from "@clerk/clerk-react";
// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import AdminProfile from './Pages/AdminProfile/AdminProfile.jsx';
import AdminRoute from './Utils/AdminRoute.jsx';
import UserRoute from './Utils/UserRoute.jsx';
import PracticeArea from './Pages/PracticeArea/PracticeArea.jsx';
import NewsPage from './Pages/News/NewsPage.jsx';
import UserProfile from './components/PeopleAtTDE/UserProfile.jsx';
import MembershipBrowse from './Pages/Memberships/MembershipBrowse.jsx';
import ResearchPaperUploadForm from './components/DocumentUpload/ResearchPaperUploadForm.jsx';
import Publications from './Pages/Publications/Publications.jsx';
import IndividualPaperPage from './components/Publications/IndividualPaperPage.jsx';
import ArticlePage from "./components/News/ArticlePage.jsx";
import OnboardingForm from './Pages/OnboardingForm/OnboardingForm.jsx';
import Setup2FA from "../src/Pages/Auth/Setup2FA.jsx";
import ForgotPassword from './Pages/Auth/ForgotPassword.jsx';
import MemberProfile from './components/PeopleAtTDE/MemberProfile.jsx';
import PricingCard from './components/Memberships/PricingCard.jsx';
import MembershipSuccess from './Pages/Memberships/MembershipSuccess.jsx';
import AdminSettings from './components/AdminProfile/AdminSettings.jsx';


function ProtectedRoute({ children, authLoading}) {
  const {account, setAccount} = useContext(DataProvider.DataContext);
  const location = useLocation();
  console.log("This is account at the time of protected route rendering--->",account);

  if (authLoading) {
    return <div>Loading...</div>; 
  }

  if (!account._id) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }
  return children;
}


function App() {
  const {account, setAccount} = useContext(DataProvider.DataContext);
  const [authLoading, setAuthLoading] = useState(true); 
  const {isLoaded, isSignedIn} = useAuth();
  const {user} = useUser();

  useEffect(()=>{
    console.log("This is the user from clerk--->", user);
    console.log("Thisis the loading and auth status--->", isLoaded, isSignedIn);
  },[isLoaded, isSignedIn, user])

  useEffect(()=>{
    if(!isLoaded) return;

      if (!isSignedIn) {
        setAccount({ _id: "", name: "", email: "", role: "", profilePicture: "" });
        setAuthLoading(false);
        return;
      }

    const syncUser = async () =>{
      

      try{

        const res = await axiosInstance.get("/api/user/me");

        const u = res.data.user;
        setAccount({
          _id: u._id,
          name: u.FullName,
          role: u.role,
          email: u.email,
          profilePicture: u.profilePicture,
          verified: u.isVerifiedbyAdmin,
        });
      }catch(err){
        console.log("Error syncing Clerk user:", err);
      }finally{
        setAuthLoading(false);
      }
    }
    syncUser();
  },[isLoaded, isSignedIn, user]);

  useEffect(() => {
    console.log("Account has been updated:", account);
  }, [account]);

  
  return (
    <HeaderCollapseProvider>
      <BrowserRouter>
        <Header />
        <AppContent authLoading={authLoading} />
        <ToastContainer position="top-right" autoClose={3000}/>
      </BrowserRouter>
    </HeaderCollapseProvider>
  );
}

function AppContent({ authLoading }) {
  const { headerCollapsed } = useContext(HeaderCollapseContext);
  const location = useLocation();
  const isAdminProfile = location.pathname === '/admin/profile';

  return (
    <div 
      className="App font-montserrat m-0 p-0"
      style={{
        paddingTop: isAdminProfile && headerCollapsed ? '110px' : '200px'
      }}
    >
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/about' element={<AboutUs/>}></Route>
            {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

            {/* Authentication elements */}
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
            <Route path="/setup-2fa" element={<Setup2FA />} />
            {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          
            {/* Events Dashboard */}
            
              <Route path='/events' element={<EventsDashboard/>}></Route>

            {/* Profile Dahsboard */}
              <Route path='/user/profile' element={<UserRoute><ProfileDashboard/></UserRoute>}></Route>  
              <Route path='/admin/profile' element={<AdminRoute><AdminProfile/></AdminRoute>}></Route>     

            {/* Executive Fellowships */}
              <Route path='/execFellowship' element={<ExecutiveFellowship authLoading={authLoading}/>}></Route>

            {/* Center For Excellence */}
              <Route path='/centreForExcellence' element={<CenterForExcellence/>}></Route>

              {/* Community Page */}
              <Route path='/community' element={<CommunityPage/>}></Route>

            {/* Our People Page */}
              <Route path='/fellowship/fellows' element={<OurPeople/>}></Route>
              <Route path='/about/profile/:id' element={<MemberProfile/>}></Route>
              <Route path='/profile/:user_id' element={<UserProfile/>}></Route>

              {/* Memberships browse page */}
              <Route path='/join-us/pricing' element={<MembershipBrowse/>}></Route>
              <Route path="/membership/success" element={<MembershipSuccess />} />
              <Route path="/membership/pricing" element={<PricingCard/>}/>


              {/* Practice Area dynamic pages */}
              <Route path='/practice/:id' element={<PracticeArea/>}></Route>

              <Route path='/news' element={<NewsPage/>}></Route>
              <Route path='/news/:articleId' element={<ArticlePage/>}></Route>

              <Route path='/doc-upload' element={<ResearchPaperUploadForm/>}></Route>

              {/* Publications Page */}
              <Route path='/publications' element={<Publications/>} ></Route>
              <Route path='/research-paper/:paper_id' element={<IndividualPaperPage/>} ></Route>

              {/* User Profile */}
              <Route path='/onboarding/:userId' element={<OnboardingForm/>}></Route>

              <Route path='/settings' element={<AdminSettings/>}/>
            </Routes>
          </div>
    );
}

export default App;