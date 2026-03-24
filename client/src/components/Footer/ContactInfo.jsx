
import { Linkedin, Facebook, Youtube, Instagram, Contact, Github, Bookmark } from 'lucide-react';
import Logo from '../Logo.jsx';

const ContactInfo = () => {
    return(
        <div className="lg:col-span-1 flex gap-x-40 justify-start items-start space-y-4" >
            <Logo className="mr-50"/>


          <div className='flex flex-col gap-y-2 w-[400px]'>            

            {/* Address */}
            <div className="text-[rgb(159,159,159)] dmsans-text text-[14px] leading-relaxed">
              <div>One World Trade Center, 85th floor, New York City, NY 10007</div>
            </div>

            <div className="text-[rgb(159,159,159)] dmsans-text text-[14px] leading-relaxed">
              <div>1717 N St NW, Washington, DC 20036</div>
            </div>

            {/* Contact Email */}
            <div>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@thedigitaleconomist.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(136,136,136)] font-normal text-[14px] dmsans-text hover:text-white hover:underline transition-colors duration-200"
              >
                info@thedigitaleconomist.com
              </a>
            </div>
            
              
            {/* Social Media Icons */}
            <div className="flex space-x-3 pt-10">
              <a href="https://www.linkedin.com/company/thedigitaleconomist/posts/?feedView=all&viewAsMember=true" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Linkedin size={16} />
              </a>
              <a href="https://www.facebook.com/people/The-Digital-Economist/100057411551026/#" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Facebook size={16} />
              </a>
              <a href="https://www.youtube.com/@thedigitaleconomist5863" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Youtube size={16} />
              </a>
              <a href="https://www.instagram.com/thedigitaleconomist/" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Instagram size={16} />
              </a>

              <a href="https://github.com/Thedigitaleconomist" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Github size={16} />
              </a>

              <a href="https://substack.com/@thedigitaleconomist" className="w-8 h-8 border border-neutral-800 bg-neutral-800 rounded flex items-center justify-center  hover:text-white transition-colors duration-200">
                <Bookmark size={16} />
              </a>


            </div>

            </div>
          </div>
    )
}

export default ContactInfo;