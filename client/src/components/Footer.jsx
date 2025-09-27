import React from 'react';
import { Linkedin, Facebook, Youtube, Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Logo/>

            {/* Contact Email */}
            <div>
              <a href="mailto:info@thedigitaleconomist.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                info@thedigitaleconomist.com
              </a>
            </div>

            {/* Address */}
            <div className="text-gray-400 leading-relaxed">
              <div>One World Trade Center, 85th</div>
              <div>floor, New York City, NY 10007</div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-white hover:text-white transition-colors duration-200">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-white hover:text-white transition-colors duration-200">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-white hover:text-white transition-colors duration-200">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-white hover:text-white transition-colors duration-200">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* About Us Column */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-base mb-6">About Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Who We Are
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  News
                </a>
              </li>
            </ul>
          </div>

          {/* Center of Excellence Column */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-base mb-6">Center of Excellence</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Governance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Applied AI
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Blockchain & Digital Assets
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Healthcare
                </a>
              </li>
            </ul>
          </div>

          {/* Executive Fellowship Column */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-base mb-6">Executive Fellowship</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Program Overview
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Fellows Directory
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Publications
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Ventures Column */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-base mb-6">Ventures</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Tech for Transparency
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Ostrom Project
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  ANER-G
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Africa Coalition
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              Copyright © 2025 The Digital Economist™.
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-gray-500">All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Demo component showing the footer
const App = () => {
  return (
    <div className=" bg-gray-100">
     
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;