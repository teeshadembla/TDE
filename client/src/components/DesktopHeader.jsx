import React, {useContext, useEffect, useState} from 'react'; 
import { useNavigate } from 'react-router';
import TemporaryDrawer from './TemporaryDrawer.jsx'; 
import Logo from "./Logo.jsx"; 
import ProfileDrawer from './ProfileDrawer.jsx';
import { ChevronDown, ArrowBigRightDash ,Menu, X } from 'lucide-react';
import LogoutButton from '../Pages/Auth/LogoutButton.jsx';

const DesktopHeader = ({practiceAreaOpen,practiceAreaOptions, handleNavClick, executiveFellowshipOptions, executiveFellowshipOpen, account, handleClick, handleLogin, setPracticeAreaOpen, setExecutiveFellowshipOpen}) =>{
    
    const navigate = useNavigate();
    
    return(
        <div className=" flex flex-col items-center justify-center h-[160px] px-[82.150px] bg-black w-full"> 
            <div className='flex justify-between w-full items-center px-[32px]'>
                
                <div onClick={() => navigate("/")} className='hidden mr-50 cursor-pointers md:block'><Logo/></div>
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

            <div className='h-[0.5px] bg-white w-full mb-5'></div>

            <div className='w-full flex justify-between items-center mb-2 px-4 sm:px-6 lg:px-8'>
                

                {/* Desktop Navigation - hidden on mobile */}
                <nav className='hidden dmsans-text lg:flex items-center space-x-6'>
                    <a 
                        href="/about" 
                        className='text-white dmsans-text hover:text-gray-300 transition-colors text-[16px] cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}
                    >
                        About Us
                    </a>

                    {/* Practice Area Dropdown */}
                    <div className='relative'>
                        <button
                            className='text-white dmsans-text hover:text-gray-300 transition-colors font-medium flex items-center'
                            onClick={() => setPracticeAreaOpen(!practiceAreaOpen)}
                            onMouseEnter={() => setPracticeAreaOpen(true)}
                            onMouseLeave={() => setPracticeAreaOpen(false)}
                        >
                            Practice Area
                            <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${practiceAreaOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {practiceAreaOpen && (
                            <div 
                                className='absolute dmsans-text left-0 top-4 mt-2 w-56 bg-white rounded-xs shadow-lg border border-gray-200 py-2 z-50'
                                onMouseEnter={() => setPracticeAreaOpen(true)}
                                onMouseLeave={() => setPracticeAreaOpen(false)}
                            >
                                {practiceAreaOptions.map((option, index) => (
                                    <a
                                        key={index}
                                        href={option.href}
                                        className='block dmsans-text px-4 py-2 text-black font-bold hover:bg-gray-100 transition-colors cursor-pointer'
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
                            className='text-white dmsans-text hover:text-gray-300 transition-colors font-medium flex items-center'
                            onClick={() => setExecutiveFellowshipOpen(!executiveFellowshipOpen)}
                            onMouseEnter={() => setExecutiveFellowshipOpen(true)}
                            onMouseLeave={() => setExecutiveFellowshipOpen(false)}
                        >
                            Executive Fellowship
                            <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${executiveFellowshipOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {executiveFellowshipOpen && (
                            <div 
                                className='absolute dmsans-text top-4 left-0 mt-2 w-50 bg-white rounded-xs shadow-lg border border-gray-200 py-2 z-50'
                                onMouseLeave={() => setExecutiveFellowshipOpen(false)}
                                onMouseEnter={() => setExecutiveFellowshipOpen(true)}
                            >
                                {executiveFellowshipOptions.map((option, index) => (
                                    <a
                                        key={index}
                                        href={option.href}
                                        className='block dmsans-text px-4 py-2 text-black font-bold hover:bg-gray-100 transition-colors cursor-pointer'
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
                        className='text-white dmsans-text hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/publications'); }}
                    >
                        Publications
                    </a>
                    
                    <a 
                        href="/events" 
                        className='text-white dmsans-text hover:text-gray-300 transition-colors font-medium cursor-pointer'
                        onClick={(e) => { e.preventDefault(); handleNavClick('/events'); }}
                    >
                        Events
                    </a>
                    
                    <a 
                        href="/news" 
                        className='text-white dmsans-text hover:text-gray-300 transition-colors font-medium cursor-pointer'
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 rounded-sm py-0.5 font-semibold text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <span className="hidden sm:inline">Fellowship Application</span>
                        <span className="sm:hidden">Apply</span>
                    </button>

                    
                </div>

                
            </div>
        </div>
    )
}

export default DesktopHeader;