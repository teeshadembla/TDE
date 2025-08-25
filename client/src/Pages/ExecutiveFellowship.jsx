import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "../components/ExecutiveFellowships/HeroSection.jsx";
import BenefitsSection from "../components/ExecutiveFellowships/BenefitsSection.jsx";
import ProgramStructure from "../components/ExecutiveFellowships/ProgramStructure.jsx";
import TestimonialsSection from "../components/ExecutiveFellowships/TestimonialsSection.jsx";
import CTASection from "../components/ExecutiveFellowships/CTASection.jsx";
import FAQSection from "../components/ExecutiveFellowships/FAQSection.jsx";
import ApplicationModal from '../components/ExecutiveFellowships/ApplicationModal.jsx';
import DataProvider from '../context/DataProvider.jsx';
import {toast} from "react-toastify";

const ExecutiveFellowship = ({authLoading}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const { account} = useContext(DataProvider.DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  if (authLoading) return; // Wait for auth to finish
  console.log(isApplicationFormOpen);

  const params = new URLSearchParams(location.search);
  const applyParam = params.get("apply");

  if (applyParam === "true") {
    if (account && account._id) {
      setIsApplicationFormOpen(true);
      // Remove the apply param so it won't reopen
      navigate(location.pathname, { replace: true });
    } else {
      // Not logged in, clean URL so it doesn't reopen automatically
      navigate(location.pathname, { replace: true });
    }
  }
}, [account, authLoading, location, navigate]);

  const handleApplyClick = () => {
    if (account && account._id) {
      setIsApplicationFormOpen(true);
    } else {
        toast.info("You need to have a valid account to apply to our fellowship programs. Kindly Login.");
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + "?apply=true")}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <HeroSection onApplyClick={handleApplyClick} />
      <BenefitsSection />
      <ProgramStructure />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onApplyClick={handleApplyClick} />
      <ApplicationModal
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />
    </div>
  );
};

export default ExecutiveFellowship;