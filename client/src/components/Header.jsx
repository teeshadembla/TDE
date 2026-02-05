import React, {useContext, useEffect, useState} from 'react'; 
import TemporaryDrawer from './TemporaryDrawer.jsx'; 
import Logo from "./Logo.jsx"; 
import DataProvider from "../context/DataProvider.jsx"; 
import axiosInstance from '../config/apiConfig.js'; 
import ProfileDrawer from './ProfileDrawer.jsx';
import { ChevronDown, Menu, X } from 'lucide-react';
import LogoutButton from '../Pages/Auth/LogoutButton.jsx';

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
        { label: 'Digital Policy', href: '/practice/digital-policy' },
        { label: 'Blockchain and Digital Assets', href: '/practice/blockchain-digital-assets' },
        { label: 'Applied AI', href: '/practice/applied-ai' },
        { label: 'Sustainability', href: '/practice/sustainability' },
        { label: 'Governance', href: '/practice/governance' },
        { label: 'Healthcare', href: '/practice/healthcare' }
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
        <div className='fixed top-0 left-0 h-16 sm:h-20 lg:h-24 w-full font-montserrat bg-black flex z-[100]'>
            
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-200' onClick={() => setMobileMenuOpen(false)}>
                    <div className='bg-white w-64 h-full shadow-lg' onClick={(e) => e.stopPropagation()}>
                        <div className='p-4 border-b'>
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className='float-right p-2 hover:bg-gray-100 rounded'
                            >
                                <X className='w-6 h-6' />
                            </button>
                            <h2 className='text-lg font-semibold'>Menu</h2>
                        </div>
                        
                        <nav className='p-4 space-y-4'>
                            <a 
                                href="/about" 
                                className='block text-gray-800 hover:text-blue-600 font-medium cursor-pointer'
                                onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}
                            >
                                About Us
                            </a>
                            
                            {/* Mobile Practice Area */}
                            <div>
                                <button
                                    className='w-full text-left text-gray-800 hover:text-blue-600 font-medium flex items-center justify-between'
                                    onClick={() => setPracticeAreaOpen(!practiceAreaOpen)}
                                >
                                    Practice Area
                                    <ChevronDown className={`w-4 h-4 transition-transform ${practiceAreaOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {practiceAreaOpen && (
                                    <div className='ml-4 mt-2 space-y-2'>
                                        {practiceAreaOptions.map((option, index) => (
                                            <a
                                                key={index}
                                                href={option.href}
                                                className='block text-gray-600 hover:text-blue-600 cursor-pointer'
                                                onClick={(e) => { e.preventDefault(); handleNavClick(option.href); }}
                                            >
                                                {option.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Executive Fellowship */}
                            <div>
                                <button
                                    className='w-full text-left text-gray-800 hover:text-blue-600 font-medium flex items-center justify-between'
                                    onClick={() => setExecutiveFellowshipOpen(!executiveFellowshipOpen)}
                                >
                                    Executive Fellowship
                                    <ChevronDown className={`w-4 h-4 transition-transform ${executiveFellowshipOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {executiveFellowshipOpen && (
                                    <div className='ml-4 mt-2 space-y-2'>
                                        {executiveFellowshipOptions.map((option, index) => (
                                            <a
                                                key={index}
                                                href={option.href}
                                                className='block text-gray-600 hover:text-blue-600 cursor-pointer'
                                                onClick={(e) => { e.preventDefault(); handleNavClick(option.href); }}
                                            >
                                                {option.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <a 
                                href="/publications" 
                                className='block text-gray-800 hover:text-blue-600 font-medium cursor-pointer'
                                onClick={(e) => { e.preventDefault(); handleNavClick('/publications'); }}
                            >
                                Publications
                            </a>
                            
                            <a 
                                href="/events" 
                                className='block text-gray-800 hover:text-blue-600 font-medium cursor-pointer'
                                onClick={(e) => { e.preventDefault(); handleNavClick('/events'); }}
                            >
                                Events
                            </a>
                            
                            <a 
                                href="/news" 
                                className='block text-gray-800 hover:text-blue-600 font-medium cursor-pointer'
                                onClick={(e) => { e.preventDefault(); handleNavClick('/news'); }}
                            >
                                News
                            </a>
                        </nav>
                    </div>
                </div>
            )}
            <div className='lg:hidden'>
                <button
                onClick={() => setMobileMenuOpen(true)}
                className='lg:hidden mt-10 ml-5 right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2'
            >
                <Menu className='w-6 h-6' />
            </button>
            </div>
            
            <div className='w-full flex justify-between items-center px-4 sm:px-6 lg:px-8'>
                <div className='hidden md:block'><Logo/></div>
                

                {/* Desktop Navigation - hidden on mobile */}
                <nav className='hidden lg:flex items-center space-x-8'>
                    <a 
                        href="/about" 
                        className='text-white hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}
                    >
                        About Us
                    </a>

                    {/* Practice Area Dropdown */}
                    <div className='relative'>
                        <button
                            className='text-white hover:text-gray-300 transition-colors font-medium flex items-center'
                            onClick={() => setPracticeAreaOpen(!practiceAreaOpen)}
                            onMouseEnter={() => setPracticeAreaOpen(true)}
                        >
                            Practice Area
                            <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${practiceAreaOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {practiceAreaOpen && (
                            <div 
                                className='absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'
                                onMouseLeave={() => setPracticeAreaOpen(false)}
                            >
                                {practiceAreaOptions.map((option, index) => (
                                    <a
                                        key={index}
                                        href={option.href}
                                        className='block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer'
                                        onClick={(e) => { e.preventDefault(); handleNavClick(option.href); }}
                                    >
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Executive Fellowship Dropdown */}
                    <div className='relative'>
                        <button
                            className='text-white hover:text-gray-300 transition-colors font-medium flex items-center'
                            onClick={() => setExecutiveFellowshipOpen(!executiveFellowshipOpen)}
                            onMouseEnter={() => setExecutiveFellowshipOpen(true)}
                        >
                            Executive Fellowship
                            <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${executiveFellowshipOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {executiveFellowshipOpen && (
                            <div 
                                className='absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'
                                onMouseLeave={() => setExecutiveFellowshipOpen(false)}
                            >
                                {executiveFellowshipOptions.map((option, index) => (
                                    <a
                                        key={index}
                                        href={option.href}
                                        className='block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer'
                                        onClick={(e) => { e.preventDefault(); handleNavClick(option.href); }}
                                    >
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <a 
                        href="/publications" 
                        className='text-white hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/publications'); }}
                    >
                        Publications
                    </a>
                    
                    <a 
                        href="/events" 
                        className='text-white hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/events'); }}
                    >
                        Events
                    </a>
                    
                    <a 
                        href="/news" 
                        className='text-white hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/news'); }}
                    >
                        News
                    </a>
                </nav>

                {/* Right side - Auth buttons and Fellowship Application */}
                <div className='flex items-center space-x-2 sm:space-x-4 sm:ml-10 md:ml-10 ml-15'>
                    {/* Fellowship Application Button - visible on all screens */}
                    <button
                        onClick={() => handleNavClick('/execFellowship')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <span className="hidden sm:inline">Fellowship Application</span>
                        <span className="sm:hidden">Apply</span>
                    </button>

                    {/* Auth section */}
                    {account?._id ? (
                        <div className='flex items-center space-x-2 sm:space-x-3'>
                            <LogoutButton/>
                            <ProfileDrawer/>
                        </div>
                    ) : (
                        <div className='flex items-center  space-x-2 sm:space-x-3'>
                            <button
                                onClick={handleClick}
                                className='border border-white h-8 sm:h-10 w-20 sm:w-24 rounded-sm bg-white text-black font-bold hover:scale-105 hover:shadow-lg transition-all text-sm sm:text-base'
                            >
                                Sign Up
                            </button>
                            
                            <button
                                onClick={handleLogin}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-6 sm:h-8 md:h-10 w-16 sm:w-20 md:w-24 lg:w-28 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors text-xs sm:text-sm md:text-base"
                            >
                                Log In
                            </button>
                        </div>
                    )}
                </div>
            </div>

            

            
        </div>
    )
}

export default Header;