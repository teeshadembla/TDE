import React from 'react';
import { Calendar, FileText, Users, Award, ArrowRight } from 'lucide-react';

export default function CenterForExcellence() {
  const workingGroups = [
    {
      title: "Sustainability",
      description: "Explores how the digital economy drives climate action, ecological balance, resource efficiency, and social responsibility through sustainable models and practices."
    },
    {
      title: "Applied AI",
      description: "Examines the real-world impact of AI across sectors, focusing on ethical integration, systemic innovation, and AI's role in addressing global challenges."
    },
    {
      title: "Governance",
      description: "Reimagines leadership, accountability, and stakeholder participation through evolving governance models for collective resource management in the digital age."
    },
    {
      title: "Healthcare",
      description: "Promotes tech-driven, data-informed health-care innovation to expand access, enhance preventative care, and support equitable, patient-centered systems."
    },
    {
      title: "Blockchain & Digital Assets",
      description: "Investigates decentralized technologies, digital ownership, and tokenized economies to enable secure transactions, identity solutions, and new value systems."
    },
    {
      title: "Policy",
      description: "Explores how regulation, public interest, and innovation intersect—shaping legislative frameworks and guiding ethical, inclusive tech progress."
    }
  ];

  const publications = [
    {
      title: "Blockchain Applications in Government: Enhancing Security, Trust, and Transparency",
      type: "Policy Paper",
      date: "May 21, 2025"
    },
    {
      title: "\"It's a bird, It's a plane...\": Capitalism is sustainability's superhero savior, not its archnemesis.",
      type: "Opinion Piece",
      date: "April 30, 2025"
    },
    {
      title: "AI and the Donut Economy: Key Instruments for United Nations Sustainable Development Goals",
      type: "Policy Paper",
      date: "April 29, 2025"
    },
    {
      title: "Grow the Pie: Improving Corporate Sustainability with New Financial Sustainability-Focused Products",
      type: "Opinion Piece",
      date: "April 18, 2025"
    },
    {
      title: "Reimagining Digital Commons: A Structured Approach to Decentralized Governance",
      type: "Research Paper",
      date: "April 7, 2025"
    },
    {
      title: "Harnessing LEO Satellites for Climate-Smart Agriculture and Biodiversity Conservation",
      type: "Opinion Piece",
      date: "April 2, 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">


      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-light text-black leading-tight">
              Center of Excellence on<br />
              <span className="font-normal">Human-centered Global Economy</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              The Center of Excellence pools creativity, innovation and intellectual power. We build actionable insights, best practices, frameworks, guidance and tools. The driving force is a curated community of Fellows who engage in an ongoing discourse on pivotal ideas and knowledge.
            </p>
            
            <div className="flex items-center justify-center space-x-3 text-sm font-medium tracking-wider">
              <span className="text-black">#HumanCentered</span>
            </div>

            <div className="mt-12 p-8 border border-gray-200 bg-gray-50 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-black">
                <Calendar className="w-5 h-5" />
                <p className="text-lg font-light">
                  Applications are reviewed on a rolling basis.
                </p>
              </div>
              <p className="mt-2 text-gray-700">
                Apply for the fall 2025-26 cohort by <strong>June 15, 2025</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working Groups Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">Working Groups</h2>
            <div className="w-24 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workingGroups.map((group, index) => (
              <div key={index} className="bg-white p-8 border border-gray-200 hover:border-black transition-colors group cursor-pointer">
                <h3 className="text-xl font-medium text-black mb-4 group-hover:text-gray-600 transition-colors">
                  {group.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {group.description}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-black" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">Publications</h2>
            <div className="w-24 h-px bg-black mx-auto mb-8"></div>
            <p className="text-gray-600 font-light">Latest first</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <article key={index} className="group cursor-pointer">
                <div className="bg-gray-100 aspect-square mb-6 flex items-center justify-center border border-gray-200 group-hover:border-black transition-colors">
                  <FileText className="w-16 h-16 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="px-3 py-1 bg-black text-white font-light tracking-wide">
                      {pub.type}
                    </span>
                    <span className="text-gray-500">{pub.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-black leading-tight group-hover:text-gray-600 transition-colors">
                    {pub.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors font-light tracking-wide">
              View All Publications
            </button>
          </div>
        </div>
      </section>

      {/* Featured Initiatives */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Featured Initiatives</h2>
            <div className="w-24 h-px bg-white mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <Award className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-xl font-medium">Capital for the Common Good</h3>
              <p className="text-gray-400 font-light">G30 group initiative at The World Bank & IMF spring meetings</p>
            </div>
            
            <div className="text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-xl font-medium">Tech for Transparency</h3>
              <p className="text-gray-400 font-light">International Anti-Corruption Conference initiative</p>
            </div>
            
            <div className="text-center space-y-4">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-xl font-medium">Meeting The Climate Challenge</h3>
              <p className="text-gray-400 font-light">Series presented at UNGA and Climate Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-black mb-8">
            Join Our Community of Fellows
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
            Engage with diverse senior business leaders, innovators, technologists and research scientists from across the globe in shaping the future of human-centered economics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors font-light tracking-wide">
              Apply Now
            </button>
            <button className="px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-colors font-light tracking-wide">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-8 bg-black"></div>
              <span className="text-lg font-light text-gray-900">Think Tank</span>
            </div>
            <p className="text-gray-600 font-light">
              © 2025 Think Tank. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}