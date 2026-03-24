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
        <div className="flex flex-col gap-10">

          {/* Contact Info (Top) */}
          <ContactInfo />

          {/* Links Section (Below Contact Info) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-40">
            <AboutUsColumn />
            <COEColumn />
            <ExecFellowshipColumn />
            <VenturesColumn />
          </div>

        </div>

        <FooterBottom/>
      </div>
    </footer>
  );
};

export default Footer;