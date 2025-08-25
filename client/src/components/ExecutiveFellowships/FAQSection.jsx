import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "What is the application process timeline?",
      answer: "Applications are reviewed on a rolling basis. The typical timeline is: Application submission → Initial review (5-7 days) → Interview process (2 weeks) → Final decision (1 week). We accept applications year-round with quarterly cohort starts."
    },
    {
      question: "What are the fellowship costs and funding options?",
      answer: "The fellowship has a participation fee of $15,000 annually, which covers all convenings, publications, and program resources. We offer partial scholarships for qualifying candidates from developing economies and academic institutions."
    },
    {
      question: "How flexible is the time commitment?",
      answer: "We understand executive schedules are demanding. The 30-hour commitment is spread across the year with flexible virtual participation options. Most activities are recorded, and we offer multiple time zones for global participation."
    },
    {
      question: "What kind of research and publications are expected?",
      answer: "Fellows contribute to policy briefs, research papers, and opinion pieces on topics within their expertise. We provide editorial support, research assistance, and ensure wide distribution through our network of partner organizations."
    }
  ];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extralight mb-6">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl font-medium">{faq.question}</span>
                {expandedFAQ === index ? 
                  <ChevronUp className="w-6 h-6 text-gray-500" /> : 
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                }
              </button>
              
              <div className={`px-8 overflow-hidden transition-all duration-300 ${
                expandedFAQ === index ? 'pb-6 max-h-96' : 'max-h-0'
              }`}>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;