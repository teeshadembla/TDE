
import { Linkedin, Facebook, Youtube, Instagram, Contact } from 'lucide-react';
import Logo from '../Logo.jsx';

const ContactInfo = () => {
    return(
        <div className="lg:col-span-1 flex flex-col justify-start items-start space-y-4" >
            <Logo className="mr-50"/>

            {/* Contact Email */}
            <div>
              <a href="mailto:info@thedigitaleconomist.com" className="text-[rgb(136,136,136)] font-normal text-[14px] dmsans-text hover:text-white hover:underline transition-colors duration-200">
                info@thedigitaleconomist.com
              </a>
            </div>

            {/* Address */}
            <div className="text-[rgb(159,159,159)] dmsans-text text-[14px] leading-relaxed">
              <div>One World Trade Center, 85th</div>
              <div>floor, New York City, NY 10007</div>
            </div>

            <div className="text-[rgb(159,159,159)] dmsans-text text-[14px] leading-relaxed">
              <div>1717 N St NW, Washington, DC 20036</div>
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
    )
}

export default ContactInfo;