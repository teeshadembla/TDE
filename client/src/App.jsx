// File: src/App.jsx
//Final build change to make sure everything deploys on new subdomain
import './App.css';
import HomePage from './Pages/HomePage.jsx'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Pages/Auth/Login.jsx';
import Signup from './Pages/Auth/Signup.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataProvider from "./context/DataProvider.jsx";
import { PermissionProvider, PermissionContext } from "./context/PermissionProvider.jsx";
import { HeaderCollapseProvider, HeaderCollapseContext } from "./context/HeaderCollapseContext.jsx";
import { useContext, useEffect, useState } from 'react';
import axiosInstance from './config/apiConfig.js';
import EventsDashboard from './Pages/Events/EventsDashboard.jsx';
import ProfileDashboard from "./Pages/Profile/ProfileDashboard.jsx";
import ExecutiveFellowship from './Pages/ExecutiveFellowship.jsx';
import CommunityPage from './Pages/CommunityPage/CommunityPage.jsx';
import OurPeople from  "./Pages/PeopleAtTDE/OurPeople.jsx";
import AboutUs from './Pages/AboutUs/AboutUs.jsx';
import { useAuth, useUser } from "@clerk/clerk-react";
import AdminProfile from './Pages/AdminProfile/AdminProfile.jsx';
import AdminRoute from './Utils/AdminRoute.jsx';
import ProtectedRoute from './Utils/ProtectedRoute.jsx';
import PracticeArea from './Pages/PracticeArea/PracticeArea.jsx';
import UserProfile from './components/PeopleAtTDE/UserProfile.jsx';
import ResearchPaperUploadForm from './components/DocumentUpload/ResearchPaperUploadForm.jsx';
import Publications from './Pages/Publications/Publications.jsx';
import IndividualPaperPage from './components/Publications/IndividualPaperPage.jsx';
import OnboardingForm from './Pages/OnboardingForm/OnboardingForm.jsx';
import Setup2FA from "../src/Pages/Auth/Setup2FA.jsx";
import ForgotPassword from './Pages/Auth/ForgotPassword.jsx';
import MemberProfile from './components/PeopleAtTDE/MemberProfile.jsx';
import PricingCard from './components/Memberships/PricingCard.jsx';
import MembershipSuccess from './Pages/Memberships/MembershipSuccess.jsx';
import AccountSettings from "./Pages/AccountSettings/AccountSettingsPage.jsx";
import IndividualEventsPage from './components/Events/IndicidualEventsPage.jsx';
import RolePermissions from './Pages/RolePermissions/RolePermissions.jsx';
import PostLoginLandingPage from './Pages/PostLoginLandingPage/PostLoginLandingPage.jsx';
import HeaderSwitcher from './components/HeaderSwitcher.jsx';
import MembershipBrowse from './Pages/Memberships/MembershipBrowse.jsx';
import DavosLaunch from './Pages/DavosLaunch.jsx';
import IRN from './Pages/IRN.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy.jsx';

function App() {
    const { account, setAccount } = useContext(DataProvider.DataContext);
    const { fetchPermissions, clearPermissions } = useContext(PermissionContext);
    const [authLoading, setAuthLoading] = useState(true);
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            // User logged out — clear both account and permissions
            setAccount({ _id: "", name: "", email: "", role: "", profilePicture: "" });
            clearPermissions();
            setAuthLoading(false);
            return;
        }

        const syncUser = async () => {
            try {
                const res = await axiosInstance.get("/api/user/me");
                const u = res.data.user;

                setAccount({
                    _id: u._id,
                    name: u.FullName,
                    role: u.role.trim(),
                    email: u.email,
                    profilePicture: u.profilePicture,
                    verified: u.isVerifiedbyAdmin,
                    activeMembership: u.activeMembership ?? null,
                });

                // Fetch permissions immediately after account is set
                await fetchPermissions();

            } catch (err) {
                console.error("ERROR syncing user:", err);
            } finally {
                setAuthLoading(false);
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user?.id]);

    return (
        <HeaderCollapseProvider>
            <BrowserRouter>
                <HeaderSwitcher />
                <AppContent authLoading={authLoading} />
                <ToastContainer position="top-right" autoClose={3000} />
            </BrowserRouter>
        </HeaderCollapseProvider>
    );
}

function AppContent({ authLoading }) {
    const { headerCollapsed } = useContext(HeaderCollapseContext);
    const location = useLocation();
    const { isSignedIn } = useAuth();
    const isAdminProfile = location.pathname === '/admin/profile';

    const PUBLIC_HEADER_HEIGHT = 180;
    const PRIVATE_HEADER_HEIGHT = 50;

    const paddingTop = isSignedIn
        ? PRIVATE_HEADER_HEIGHT
        : (isAdminProfile && headerCollapsed ? 110 : PUBLIC_HEADER_HEIGHT);

    return (
        <div className="App font-montserrat m-0 p-0" style={{ paddingTop }}>
            <Routes>

                {/* ── PUBLIC ROUTES ──────────────────────────────────────────
                    No auth required. Accessible by anyone. */}
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/setup-2fa' element={<Setup2FA />} />
                <Route path='/events' element={<EventsDashboard />} />
                <Route path='/execFellowship' element={<ExecutiveFellowship authLoading={authLoading} />} />
                <Route path='/fellowship/fellows' element={<OurPeople />} />
                <Route path='/about/profile/:id' element={<MemberProfile />} />
                <Route path='/practice/:id' element={<PracticeArea />} />
                <Route path='/publications' element={<Publications />} />
                <Route path='/research-paper/:paper_id' element={<IndividualPaperPage />} />
                <Route path='/membership/pricing' element={<PricingCard />} />
                <Route path='/davos' element={<DavosLaunch/>}/>
                <Route path='/regenerative-digital-infrastructure' element={<IRN/>}/>
                <Route path='privacy-policy' element={<PrivacyPolicy/>}/>

                {/* ── PROTECTED ROUTES ───────────────────────────────────────
                    Requires login. Fine-grained checks inside components. */}
                <Route path='/user/profile' element={
                    <ProtectedRoute><ProfileDashboard /></ProtectedRoute>
                } />
                <Route path='/settings/*' element={
                    <ProtectedRoute><AccountSettings /></ProtectedRoute>
                } />
                <Route path='/just-for-you' element={
                    <ProtectedRoute><PostLoginLandingPage /></ProtectedRoute>
                } />
                <Route path='/doc-upload' element={
                    <ResearchPaperUploadForm />
                } />
                <Route path='/community' element={
                    <CommunityPage />
                } />
                <Route path='/profile/:user_id' element={
                    <ProtectedRoute><UserProfile /></ProtectedRoute>
                } />
                <Route path='/onboarding/:userId' element={
                    <ProtectedRoute><OnboardingForm /></ProtectedRoute>
                } />
                <Route path='/events/:id' element={
                    <IndividualEventsPage />
                } />
                <Route path='/membership/success' element={
                    <MembershipSuccess />
                } />

                <Route path='/join-us/pricing' element={
                    <MembershipBrowse></MembershipBrowse>
                }></Route>

                {/* ── ADMIN ROUTES ───────────────────────────────────────────
                    Requires login AND role === 'admin' or 'core'. */}
                <Route path='/admin/profile' element={
                    <AdminRoute><AdminProfile /></AdminRoute>
                } />
                <Route path='/admin/roles' element={
                    <AdminRoute><RolePermissions /></AdminRoute>

                } />

            </Routes>
        </div>
    );
}

export default App;