import React, {useContext, useEffect, useState} from 'react'; 
import { useNavigate } from 'react-router';
import TemporaryDrawer from './TemporaryDrawer.jsx'; 
import Logo from "./Logo.jsx"; 
import DataProvider from "../context/DataProvider.jsx"; 
import axiosInstance from '../config/apiConfig.js'; 
import ProfileDrawer from './ProfileDrawer.jsx';
import { ChevronDown, Menu, X } from 'lucide-react';
import LogoutButton from '../Pages/Auth/LogoutButton.jsx';


const MobileHeader = ({handleNavClick, executiveFellowshipOptions,practiceAreaOpen, executiveFellowshipOpen, setMobileMenuOpen, setPracticeAreaOpen, practiceAreaOptions, setExecutiveFellowshipOpen}) =>{
    return(
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
    )
}

export default MobileHeader;