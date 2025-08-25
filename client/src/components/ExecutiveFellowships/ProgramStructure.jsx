import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const ProgramStructure = () => {
  const commitments = [
    {
      title: "Strategic Time Investment",
      description: "Minimum 30 hours annually for strategic convenings, research contributions, and collaborative initiatives with flexible scheduling.",
      icon: Calendar,
      stats: "30 hrs/year",
      detail: "Includes quarterly virtual sessions and annual summit"
    },
    {
      title: "Thought Leadership Publications",
      description: "Contribute to three high-impact publications per year, showcased at major international forums and conferences.",
      icon: BookOpen,
      stats: "3 publications",
      detail: "Published in partnership with leading academic institutions"
    },
    {
      title: "Global Convenings",
      description: "Participate in exclusive in-person gatherings across key economic centers including New York, London, Singapore, and Dubai.",
      icon: Globe,
      stats: "4 cities",
      detail: "Premium venues with C-suite executives and policymakers"
    },
    {
      title: "Executive Mentorship",
      description: "Lead strategic discussions, mentor emerging leaders, and represent the think tank at premier global events.",
      icon: Award,
      stats: "1:1 mentoring",
      detail: "Direct access to Nobel laureates and former heads of state"
    }
  ];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extralight mb-6">Program Structure</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive framework designed to maximize your impact and influence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {commitments.map((commitment, index) => {
            const IconComponent = commitment.icon;
            return (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gray-100 rounded-full group-hover:bg-black transition-colors duration-300">
                    <IconComponent className="w-8 h-8 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-light">{commitment.title}</h3>
                      <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                        {commitment.stats}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">{commitment.description}</p>
                    <p className="text-sm text-gray-500 italic">{commitment.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramStructure;