import React, {useContext, useEffect, useState} from 'react'; 
import { useNavigate } from 'react-router';
import TemporaryDrawer from './TemporaryDrawer.jsx'; 
import Logo from "./Logo.jsx"; 
import DataProvider from "../context/DataProvider.jsx"; 
import axiosInstance from '../config/apiConfig.js'; 
import ProfileDrawer from './ProfileDrawer.jsx';
import { ChevronDown, Menu, ArrowRight,X } from 'lucide-react';
import LogoutButton from '../Pages/Auth/LogoutButton.jsx';
import DesktopHeader from './DesktopHeader.jsx';
import MobileHeader from './MobileHeader.jsx';

const Header = () => {
    const {account, setAccount} = useContext(DataProvider.DataContext);
    const [practiceAreaOpen, setPracticeAreaOpen] = useState(false);
    const [executiveFellowshipOpen, setExecutiveFellowshipOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock navigation function - replace with your actual router
    const navigate = (path) => {
        console.log('Navigating to:', path);
        // Your actual navigation logic here
        window.location.href = path; // Simple fallback
    };
    
    const handleClick = () => {
        navigate("/signup");
    }

    const handleLogin = () => {
        navigate("/login");
    }

    // Practice Area dropdown options
    const practiceAreaOptions = [
        { label: 'Tech Policy and Governance', href: '/practice/digital-policy' },
        { label: 'Digital Assets and Blockchain', href: '/practice/blockchain-digital-assets' },
        { label: 'Sustainability in Tech', href: '/practice/sustainability' },
        { label: 'Applied Artificial Intelligence', href: '/practice/applied-ai' },
        { label: 'Healthcare Innovation', href: '/practice/healthcare' }
    ];

    // Executive Fellowship dropdown options
    const executiveFellowshipOptions = [
        { label: 'Current Programs', href: '/execFellowship' },
        { label: 'The Digital Economist Fellows', href: '/fellowship/fellows' }
    ];

    const handleNavClick = (href) => {
        navigate(href);
        setMobileMenuOpen(false);
    };


    return (
        <div id='main-header' className='fixed top-0 left-0 w-full font-montserrat z-[100]'>
            <div className='w-full h-[40px] flex items-center justify-center bg-[rgb(0,74,173)] bg-gradient-to-r from-[rgb(0,74,173)] to-[rgb(6,44,101)] text-white py-0 px-4 text-[12.5px]'>
                <a href='https://docsend.com/view/8ken6c6i84m8bwcu' className='flex items-center justify-center'>
                    <p className='hover:underline'>Join The Institutional Research Network.</p>
                    <ArrowRight size={18} strokeWidth={1.5} />
                </a>
            </div>

            {/* Main Header Navigation */}
            <div className='h-16 sm:h-20 lg:h-24 w-full bg-black flex'>
                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <MobileHeader 
                        executiveFellowshipOptions={executiveFellowshipOptions} 
                        setExecutiveFellowshipOpen={setExecutiveFellowshipOpen} 
                        practiceAreaOptions={practiceAreaOptions} 
                        setPracticeAreaOpen={setPracticeAreaOpen} 
                        setMobileMenuOpen={setMobileMenuOpen} 
                        handleNavClick={handleNavClick} 
                        practiceAreaOpen={practiceAreaOpen} 
                        executiveFellowshipOpen={executiveFellowshipOpen}
                    />
                )}
                
                <div className='lg:hidden'>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className='lg:hidden mt-10 ml-5 right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2'
                    >
                        <Menu className='w-6 h-6' />
                    </button>
                </div>
                
                <DesktopHeader 
                    practiceAreaOptions={practiceAreaOptions} 
                    practiceAreaOpen={practiceAreaOpen} 
                    executiveFellowshipOpen={executiveFellowshipOpen} 
                    executiveFellowshipOptions={executiveFellowshipOptions} 
                    handleNavClick={handleNavClick} 
                    account={account} 
                    handleClick={handleClick} 
                    handleLogin={handleLogin} 
                    setPracticeAreaOpen={setPracticeAreaOpen} 
                    setExecutiveFellowshipOpen={setExecutiveFellowshipOpen}
                /> 
            </div>
        </div>
    )
}

export default Header;