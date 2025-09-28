import React from "react";

const KeyThemesSection = ({ keythemes }) => {


  const themes = keythemes ;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Key Themes
          </h2>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {themes.map((theme, index) => (
            <div
              key={index}
              className="relative bg-gray-800 rounded-xl p-6 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden hover:shadow-2xl group"
            >
              {/* Bottom Right Corner Blue Glow on Hover */}
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-blue-600 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out rounded-full blur-xl"></div>
              
              {/* Additional solid glow */}
              <div className="absolute bottom-0 right-0 w-20 h-20  from-blue-700 to-transparent  opacity-0 group-hover:opacity-80 transition-all duration-300 ease-in-out"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 transition-colors duration-300">
                  {theme.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed transition-colors duration-300">
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyThemesSection;