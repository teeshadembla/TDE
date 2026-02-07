import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
        "id": 1,
        "question": "What is the duration of the Executive Fellowship?",
        "answer": "The fellowship is a one-year program, starting on September 1, 2025, and ending on August 31, 2026."
    },
    {
        "id": 2,
        "question": "How selective is the program?",
        "answer": "The Executive Fellowship is highly exclusive, admitting only a select group of professionals to ensure a focused and impactful experience."
    },
    {
        "id": 3,
        "question": "What are the application requirements?",
        "answer": "Applicants should demonstrate a strong track record of leadership, innovation, or systems thinking and a commitment to using digital technologies for human and planetary outcomes."
    },
    {
        "id": 4,
        "question": "Is there a cost associated with the program?",
        "answer": "Yes, there is a one-time administrative fee associated with the Executive Fellowship program."
    },
    {
        "id": 5,
        "question": "What kind of commitment is expected from Executive fellows?",
        "answer": "Fellows are expected to actively participate in strategic roundtables, and major events, contributing their expertise and insights to the Center's initiatives."
    },
    {
        "id": 6,
        "question": "What support will I receive during the fellowship?",
        "answer": "Fellows will receive continuous peer learning, mentorship, as well as on-demand consultation with the Fellowship team."
    },
    {
        "id": 7,
        "question": "How can I apply for the fellowship?",
        "answer": "Applications can be submitted online during the application period. The application form will remain available on our platforms until June 15, 2025."
    },
    {
        "id": 8,
        "question": "What are the key dates for the program?",
        "answer": "Application Deadline: June 15, 2025 | Program Start: September 1, 2025 | Program End: August 31, 2026"
    },
    {
        "id": 9,
        "question": "Are there any in-person events I need to attend?",
        "answer": "There will be numerous opportunities throughout the year for fellows to join events in person; however, this is not a mandatory requirement to be a part of the program."
    },
    {
        "id": 10,
        "question": "What benefits do fellows receive?",
        "answer": "Fellows receive numerous benefits, including access to The Digital Economist ecosystem, numerous impact projects to engage with on, high-level networking opportunities, as well as over a 500 virtual and in-person events during the Fellowship."
    },
    {
        "id": 11,
        "question": "Can I apply if I am an early career professional?",
        "answer": "Yes, the program is open to visionary professionals at all career stages who are committed to making a global impact."
    },
    {
        "id": 12,
        "question": "Will I receive a certificate upon completion?",
        "answer": "Yes, fellows will receive a certificate recognizing their completion of the program."
    }
  ];

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-4 md:mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-black">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-black">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-4 md:px-6 lg:px-4 py-6 md:py-8 text-left flex items-start dmsans-text font-semibold md:items-center justify-between cursor-pointer transition-all"
              >
                <span className="text-base md:text-lg lg:text-xl font-bold pr-4 md:pr-8 flex-1">
                  {faq.question}
                </span>
                {expandedFAQ === index ? 
                  <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0 mt-1 md:mt-0" /> : 
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0 mt-1 md:mt-0" />
                }
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <p className="px-4 md:px-6 lg:px-8 pb-6 md:pb-8 dmsans-text text-base md:text-lg lg:text-[18px] text-neutral-500 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;