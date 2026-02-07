const FooterBottom = () => {
    return (
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 dmsans-text text-sm">
              Copyright © {new Date().getFullYear()} The Digital Economist™.
            </div>
            <div className="flex space-x-8 dmsans-text text-sm">
              <a href="#" className="text-gray-500 dmsans-text hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-gray-500 dmsans-text">All Rights Reserved.</span>
            </div>
          </div>
        </div>
    )

}

export default FooterBottom;