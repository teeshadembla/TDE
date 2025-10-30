const OrganizationCard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white shadow-2xl">
      <h2 className="text-4xl font-bold mb-6">
        Get your organization involved, help shape the future
      </h2>
      
      <p className="text-gray-300 text-lg mb-8 leading-relaxed">
        The World Economic Forum brings together leaders from business, government, academia and civil society, fostering a unique cross-sectoral dialogue and collaboration environment.
      </p>

      <p className="text-gray-300 text-base mb-10 leading-relaxed">
        By participating in our events, projects and initiatives, organisations gain unique opportunities to contribute to sustainable development, address global challenges, gain access to expert knowledge and forge strategic partnerships.
      </p>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors flex items-center gap-2 group">
        <span>Contact us to join</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default OrganizationCard;