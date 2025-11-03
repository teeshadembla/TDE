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
// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import AdminProfile from './Pages/AdminProfile/AdminProfile.jsx';
import AdminRoute from './Utils/AdminRoute.jsx';
import UserRoute from './Utils/UserRoute.jsx';
import PracticeArea from './Pages/PracticeArea/PracticeArea.jsx';
import NewsPage from './Pages/News/NewsPage.jsx';
import UserProfile from './components/PeopleAtTDE/UserProfile.jsx';
import MembershipBrowse from './Pages/Memberships/MembershipBrowse.jsx';/* 
import DocumentUpload from './Pages/Publications/DocumentUpload.jsx'; */
import ResearchPaperUploadForm from './components/DocumentUpload/ResearchPaperUploadForm.jsx';
import Publications from './Pages/Publications/Publications.jsx';
import IndividualPaperPage from './components/Publications/IndividualPaperPage.jsx';
import ArticlePage from "./components/News/ArticlePage.jsx";

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

  useEffect(()=>{
    const validateUser = async() =>{
      try{
        const res = await axiosInstance.get("/api/user/me");
        console.log(res);
        console.log("before being updated",account);

        const user = res.data.user;
        setAccount({
          _id: user._id,
          name: user.name,
          role: user.role,
          email:user.email,
          profilePicture: user.profilePicture,
        })
      }catch(err){
        console.log("Some error has occured in frontend--->", err);
      }finally {
        setAuthLoading(false); // stop loading
      }
    }
    validateUser();
  },[])

  useEffect(() => {
    console.log("Account has been updated:", account);
  }, [account]);


  return (
    <BrowserRouter>
      <Header></Header>
        <div className="App">
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/about' element={<AboutUs/>}></Route>
            {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

            {/* Authentication elements */}
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
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
              <Route path='/profile/:user_id' element={<UserProfile/>}></Route>

              {/* Memberships browse page */}
              <Route path='/join-us/pricing' element={<MembershipBrowse/>}></Route>

              {/* Practice Area dynamic pages */}
              <Route path='/practice/:slug' element={<PracticeArea/>}></Route>

              <Route path='/news' element={<NewsPage/>}></Route>
              <Route path='/news/:articleId' element={<ArticlePage/>}></Route>

              <Route path='/doc-upload' element={<ResearchPaperUploadForm/>}></Route>

              {/* Publications Page */}
              <Route path='/publications' element={<Publications/>} ></Route>
              <Route path='/research-paper/:paper_id' element={<IndividualPaperPage/>} ></Route>

          </Routes>

          <ToastContainer position="top-right" autoClose={3000}/>
        </div>
    </BrowserRouter>
  );
}

export default App;
