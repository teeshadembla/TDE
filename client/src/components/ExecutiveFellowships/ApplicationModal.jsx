import React, { useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from "react-toastify";
import axiosInstance from "../../config/apiConfig.js";
import DataProvider from '../../context/DataProvider.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51RtF9nQom0p8YmDWYpORq8aJSFZ41I8jJtZAaWclT5hTdS0Br15REB1cMZUkJI2nNbXHdSEuECF320gvOnTYALu100qti58qa3");

// Inner component that uses Stripe hooks
const ApplicationForm = ({ onClose }) => {
  const { account } = useContext(DataProvider.DataContext);
  const stripe = useStripe();
  const elements = useElements();
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Application Info, 2: Payment Method
  const [formData, setFormData] = useState({
    userId: account?._id || '',
    organization: '',
    position: '',
    experience: '',
    motivation: '',
    workGroupId: '',
    linkedin: '',
    startDate: '',
    commitment: false,
    cycle: '',
  });
  const [workGroups, setWorkGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState('');

  useEffect(() => {
    const setUser = () => {
      setFormData(prev => ({
        ...prev,
        userId: account?._id || ''
      }));
    }
    setUser();
  }, [account])

  useEffect(() => {
    const fetchWorkgroups = async () => {
      try {
        const result = await axiosInstance.get("/api/fellowship/getWorkgroups");
        setWorkGroups(result.data.data || []);
      } catch (error) {
        console.error("Error fetching workgroups:", error);
        toast.error("Failed to load workgroups");
      }
    }
    if (onClose) { // Modal is open
      fetchWorkgroups();
    }
  }, [])

  const getUpcomingCycles = () => {
    const today = new Date();
    const year = today.getFullYear();
    const cycleMonths = [
      { month: 0, name: "January" },
      { month: 2, name: "March" },
      { month: 5, name: "June" },
      { month: 9, name: "October" }
    ];
    
    let cycles = [];
    
    cycleMonths.forEach(({ month, name }) => {
      const cycleDate = new Date(year, month, 1);
      if (cycleDate >= today) {
        cycles.push({ id: `${name} ${year}`, name: `${name} ${year}` });
      }
    });
    
    const nextYear = year + 1;
    cycleMonths.forEach(({ month, name }) => {
      if (cycles.length < 4) {
        cycles.push({ id: `${name} ${nextYear}`, name: `${name} ${nextYear}` });
      }
    });
    
    return cycles;
  };

  const cycles = getUpcomingCycles();

  const validateForm = () => {
    const requiredFields = [
      'organization', 'position', 'experience', 'motivation',
      'workGroupId', 'linkedin', 'startDate', 'cycle'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    
    if (!formData.commitment) {
      toast.error('Please accept the commitment requirement.');
      return false;
    }
    
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(formData.linkedin)) {
      toast.error('Please enter a valid LinkedIn profile URL.');
      return false;
    }
    
    return true;
  };

  // Move to payment step
  const handleContinueToPayment = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create Setup Intent to collect payment method
      const { data } = await axiosInstance.post('/api/fellowship/registration/create-setup-intent', {
        userId: formData.userId
      });
      
      setSetupIntentClientSecret(data.clientSecret);
      setCurrentStep(2); // Move to payment step
      
    } catch (error) {
      console.error("Error creating setup intent:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit application with payment method
  const handleSubmitWithPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Confirm card setup
      const { error, setupIntent } = await stripe.confirmCardSetup(setupIntentClientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: account?.name || account?.FullName || '',
            email: account?.email || ''
          }
        }
      });

      if (error) {
        console.error("Card setup error:", error);
        toast.error(`Failed to save payment method: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Payment method saved successfully, now submit application
      const response = await axiosInstance.post('/api/fellowship/registration/submitFellowshipApplication', {
        userId: formData.userId,
        workGroupId: formData.workGroupId,
        cycle: formData.cycle,
        experience: formData.experience,
        motivation: formData.motivation,
        organization: formData.organization,
        position: formData.position,
        linkedin: formData.linkedin,
        startDate: formData.startDate,
        account: account,
        paymentMethodId: setupIntent.payment_method // Include payment method ID
      });

      if (response.data.success) {
        toast.success("Application submitted successfully with payment method saved! You'll receive an email once it's reviewed.");
        
        // Reset form
        setFormData({
          userId: account?._id || '',
          organization: '',
          position: '',
          experience: '',
          motivation: '',
          workGroupId: '',
          linkedin: '',
          startDate: '',
          commitment: false,
          cycle: '',
        });
        
        onClose();
      } else {
        toast.error(response.data.message || "Failed to submit application");
      }
      
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleBack = () => {
    if (isSubmitting) return;
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="flex max-w-6xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <div className="bg-white w-1/2 overflow-y-auto">
          <div className="p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-light">
                  {currentStep === 1 ? 'Fellowship Application' : 'Payment Information'}
                </h3>
                <p className="text-gray-600 mt-2">
                  {currentStep === 1 
                    ? 'Join the next generation of global leaders'
                    : 'Save your payment method for future billing'
                  }
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* STEP 1: Application Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Organization & Position */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Organization *</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your current organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Current Position *</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                {/* Cycle & Experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select Fellowship Cycle *</label>
                    <select
                      value={formData.cycle}
                      onChange={(e) => setFormData(prev => ({ ...prev, cycle: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a cycle</option>
                      {cycles.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Years of Relevant Experience *</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-15">10-15 years</option>
                      <option value="15-20">15-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>
                </div>

                {/* LinkedIn & Start Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">LinkedIn Profile *</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Proposed Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Workgroups */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Workgroup *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {workGroups.map((wg) => (
                      <label
                        key={wg._id}
                        className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-200 ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="workGroup"
                          checked={formData.workGroupId === wg._id}
                          onChange={() => !isSubmitting && setFormData(prev => ({ ...prev, workGroupId: wg._id }))}
                          disabled={isSubmitting}
                          className="w-4 h-4 text-black focus:ring-black border-gray-300 disabled:opacity-50"
                        />
                        <span className="text-sm font-medium">{wg.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Why are you interested in joining our Fellowship? *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-black resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Please describe your motivation, relevant experience, and what you hope to contribute..."
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-500">
                    {formData.motivation.length}/1000 characters
                  </div>
                </div>

                {/* Commitment */}
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="commitment"
                    checked={formData.commitment}
                    onChange={(e) => !isSubmitting && setFormData(prev => ({ ...prev, commitment: e.target.checked }))}
                    disabled={isSubmitting}
                    className="mt-1 w-5 h-5 text-black focus:ring-black border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="commitment" className={`text-sm text-gray-700 leading-relaxed ${!isSubmitting ? 'cursor-pointer' : 'cursor-default'}`}>
                    I understand and commit to the minimum 30-hour annual requirement and agree to actively participate in fellowship activities and workgroup sessions.
                  </label>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">What happens next?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        After providing your payment information, your application will be reviewed. If approved, we'll automatically charge your saved payment method and confirm your fellowship enrollment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleContinueToPayment}
                    disabled={isSubmitting}
                    className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-4 border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Secure Payment</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your card will NOT be charged now. We'll only charge your card if your application is approved.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Card Information *</label>
                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                        hidePostalCode: false,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Fellowship fees: $4,000 (0-5 years experience) or $8,000 (5+ years experience)
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Your payment is secure</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        We use Stripe to securely store your payment information. We never see or store your full card details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-6 py-4 border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitWithPayment}
                    disabled={!stripe || isSubmitting}
                    className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Application...
                      </>
                    ) : (
                      'Save Card & Submit Application'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div 
          style={{
            backgroundImage: 'url("https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68662e2e70b9174c52186b5f_People%20seated%20at%20tables.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }} 
          className='w-1/2'
        />
      </div>
    </div>
  );
};

// Main modal component that wraps with Stripe Elements
const ApplicationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <ApplicationForm onClose={onClose} />
    </Elements>
  );
};

export default ApplicationModal;