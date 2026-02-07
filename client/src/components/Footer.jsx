import React from 'react';
import ContactInfo from './Footer/ContactInfo';
import FooterBottom from './Footer/FooterBottom';
import AboutUsColumn from './Footer/AboutUsColumn';
import COEColumn from './Footer/COEColumn';
import ExecFellowshipColumn from './Footer/ExecFellowshipColumn';
import VenturesColumn from './Footer/VenturesColumn';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[850px] lg:grid-cols-2 gap-8 lg:gap-20">

          {/* Logo and Contact Info */}
          <ContactInfo />
            <div className='grid grid-cols-4 lg:grid-cols-4 gap-12 lg:gap-12 w-[800px]'>
              {/* About Us Column */}
              <AboutUsColumn />

              {/* Center of Excellence Column */}
              <COEColumn/>

              {/* Executive Fellowship Column */}
              <ExecFellowshipColumn/>

              {/* Ventures Column */}
              <VenturesColumn/>
            </div>
          </div>

        <FooterBottom/>
      </div>
    </footer>
  );
};


export default Footer;