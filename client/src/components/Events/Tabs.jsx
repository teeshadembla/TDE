import react from "react";

const Tabs = ({setActiveTab, activeTab}) =>{
    return(
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {[
              { key: 'upcoming', label: 'Upcoming Events' },
              { key: 'participated', label: 'My Events' },
              { key: 'past', label: 'Past Events' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
    )
}

export default Tabs;