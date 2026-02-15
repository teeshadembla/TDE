const VenturesColumn = () => {
    return (
                  <div className="space-y-4 w-[125px] pr-[20px] dmsans-text">
            <h3 className="text-[rgb(173,173,173)] font-semibold text-[15.4px] text-base mb-6">Ventures</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://www.techfortransparency.com/" target="_blank" rel="noopener noreferrer" className="text-white font-normal text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Tech for Transparency
                </a>
              </li>
              <li>
                <a href="https://www.ostromproject.com/" target="_blank" rel="noopener noreferrer" className="text-white font-normal text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Ostrom Project
                </a>
              </li>
              <li>
                <a href="https://www.aner-g.com/" target="_blank" rel="noopener noreferrer" className="text-white font-normal text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  ANER-G
                </a> 
              </li>
              <li>
                <a href="https://www.africacoalition.com/" target="_blank" rel="noopener noreferrer" className="text-white font-normal text-[14px] hover:text-white transition-colors duration-200 text-sm">
                  Africa Coalition
                </a>
              </li>
            </ul>
          </div>
    )
}

export default VenturesColumn;