const AboutUsColumn = () => {
    return(
        <div className="space-y-4 pr-[20px] dmsans-text w-[125px]">
            <h3 className="text-[rgb(173,173,173)] font-semibold  text-[15.4px] text-base mb-6">About Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-white font-normal leading-[18.2px] text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Who We Are
                </a>
              </li>
              <li>
                <a href="#" className="text-white font-normal leading-[18.2px] text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Institutional Research Network
                </a>
              </li>

              <li>
                <a href="#" className="text-white font-normal leading-[18.2px] text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Davos 2026 Press Announcement
                </a>
              </li>
            </ul>
          </div>
    )
}

export default AboutUsColumn;