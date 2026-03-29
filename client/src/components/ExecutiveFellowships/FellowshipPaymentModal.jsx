import { useState, useEffect, useContext } from 'react';
import { X, CreditCard, Tag, GraduationCap, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../../config/apiConfig.js';
import DataProvider from '../../context/DataProvider.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RtF9nQom0p8YmDWYpORq8aJSFZ41I8jJtZAaWclT5hTdS0Br15REB1cMZUkJI2nNbXHdSEuECF320gvOnTYALu100qti58qa3');

/* ── inner form that uses Stripe hooks ── */
const PaymentForm = ({ application, onSuccess, onClose }) => {
  const { account } = useContext(DataProvider.DataContext);
  const stripe = useStripe();
  const elements = useElements();

  const [setupData, setSetupData] = useState(null);     // from create-setup-intent
  const [scholarship, setScholarship] = useState(null); // existing scholarship record
  const [scholarshipStep, setScholarshipStep] = useState('idle'); // idle | form | submitted | approved | rejected
  const [scholarshipReason, setScholarshipReason] = useState('');

  const [discountCode, setDiscountCode] = useState('');
  const [discountPreview, setDiscountPreview] = useState(null); // { discountAmount, finalAmount }
  const [validatingCode, setValidatingCode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── on mount: fetch setup-intent data + any existing scholarship ── */
  useEffect(() => {
    const init = async () => {
      try {
        const [setupRes, scholarshipRes] = await Promise.all([
          axiosInstance.post('/api/fellowship/registration/create-setup-intent', {
            userId: account._id,
            applicationId: application._id,
          }),
          axiosInstance.get(`/api/scholarship/application/${application._id}`),
        ]);
        setSetupData(setupRes.data);
        if (scholarshipRes.data.scholarship) {
          setScholarship(scholarshipRes.data.scholarship);
          if (scholarshipRes.data.scholarship.status === 'REQUESTED') {
            setScholarshipStep('submitted');
          } else if (scholarshipRes.data.scholarship.status === 'APPROVED') {
            setScholarshipStep('approved');
          } else if (scholarshipRes.data.scholarship.status === 'REJECTED') {
            setScholarshipStep('rejected');
          }
        }
      } catch (err) {
        toast.error('Failed to load payment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [application._id, account._id]);

  /* ── computed amounts ── */
  const originalAmount = setupData?.originalAmount ?? application.amount;
  const effectiveAmount = discountPreview
    ? discountPreview.finalAmount
    : scholarship?.status === 'APPROVED'
    ? (scholarship.finalAmount ?? 0)
    : originalAmount;

  const isFreeAfterScholarship =
    scholarship?.status === 'APPROVED' && scholarship.finalAmount === 0;

  /* ── validate discount code ── */
  const handleValidateCode = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    try {
      const { data } = await axiosInstance.post('/api/discount/validate', {
        code: discountCode.trim(),
        applicationId: application._id,
        userId: account._id,
      });
      setDiscountPreview({ discountAmount: data.discountAmount, finalAmount: data.finalAmount });
      toast.success(`Code applied! You save $${(data.discountAmount / 100).toFixed(2)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid discount code');
      setDiscountPreview(null);
    } finally {
      setValidatingCode(false);
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPreview(null);
  };

  /* ── submit scholarship request ── */
  const handleScholarshipRequest = async () => {
    if (!scholarshipReason.trim()) {
      toast.error('Please provide a reason for your scholarship request.');
      return;
    }
    try {
      await axiosInstance.post('/api/scholarship/request', {
        userId: account._id,
        applicationId: application._id,
        requestReason: scholarshipReason.trim(),
      });
      toast.success('Scholarship request submitted. We will review it and notify you.');
      setScholarshipStep('submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit scholarship request');
    }
  };

  /* ── complete payment ── */
  const handlePay = async () => {
    if (isFreeAfterScholarship) {
      // Full scholarship — just confirm
      setIsSubmitting(true);
      try {
        await axiosInstance.post('/api/fellowship/registration/complete-payment', {
          userId: account._id,
          applicationId: application._id,
        });
        toast.success('Your full scholarship has been confirmed. Welcome to the fellowship!');
        onSuccess();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to confirm enrollment');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      let paymentMethodId = null;

      if (setupData?.hasSavedCard) {
        // Use existing saved card
        paymentMethodId = null; // backend will use user.stripePaymentMethodId
      } else {
        // Confirm new card setup
        const cardElement = elements.getElement(CardElement);
        const { error, setupIntent } = await stripe.confirmCardSetup(setupData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: account?.FullName || account?.name || '',
              email: account?.email || '',
            },
          },
        });
        if (error) {
          toast.error(`Card error: ${error.message}`);
          setIsSubmitting(false);
          return;
        }
        paymentMethodId = setupIntent.payment_method;
      }

      await axiosInstance.post('/api/fellowship/registration/complete-payment', {
        userId: account._id,
        applicationId: application._id,
        paymentMethodId,
        discountCode: discountPreview ? discountCode.trim() : undefined,
      });

      toast.success('Payment completed! Welcome to the fellowship!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-light text-gray-900">Complete Your Payment</h3>
          <p className="text-gray-500 mt-1 text-sm">
            {application.fellowship?.cycle || ''} · {application.workgroupId?.title || ''}
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 text-black rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Amount summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Fellowship fee ({application.userStat})</span>
          <span>${(originalAmount / 100).toFixed(2)}</span>
        </div>
        {discountPreview && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({discountCode.toUpperCase()})</span>
            <span>−${(discountPreview.discountAmount / 100).toFixed(2)}</span>
          </div>
        )}
        {scholarship?.status === 'APPROVED' && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Scholarship ({scholarship.scholarshipType === 'full' ? 'Full waiver' : 'Partial'})</span>
            <span>−${(((originalAmount - (scholarship.finalAmount ?? 0)) / 100)).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t border-gray-200">
          <span>Total due</span>
          <span>${(effectiveAmount / 100).toFixed(2)}</span>
        </div>
      </div>

      {/* Full scholarship — no payment needed */}
      {isFreeAfterScholarship && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Full scholarship applied</p>
            <p className="text-sm text-green-700 mt-1">Your fellowship fee has been fully waived. Click below to confirm your enrollment.</p>
          </div>
        </div>
      )}

      {/* Scholarship section — only show if payment is still required */}
      {!isFreeAfterScholarship && !discountPreview && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setScholarshipStep(scholarshipStep === 'idle' ? 'form' : 'idle')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            disabled={scholarshipStep === 'submitted' || scholarshipStep === 'approved' || scholarshipStep === 'rejected'}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {scholarshipStep === 'submitted' ? 'Scholarship request pending review'
                  : scholarshipStep === 'approved' ? 'Scholarship applied'
                  : scholarshipStep === 'rejected' ? 'Scholarship request not approved'
                  : 'Request a scholarship'}
              </span>
            </div>
            {scholarshipStep === 'submitted' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Under review</span>}
            {scholarshipStep === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {scholarshipStep === 'rejected' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {scholarshipStep === 'idle' && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {scholarshipStep === 'form' && <X className="w-4 h-4 text-gray-400" />}
          </button>

          {scholarshipStep === 'form' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              <p className="text-xs text-gray-500">Scholarships are reviewed on a case-by-case basis. Discounts cannot be applied while a scholarship request is pending or approved.</p>
              <textarea
                rows={4}
                value={scholarshipReason}
                onChange={(e) => setScholarshipReason(e.target.value)}
                className="w-full border-2 text-neutral-600 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none text-sm"
                placeholder="Please explain why you are requesting a scholarship..."
                maxLength={2000}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleScholarshipRequest}
                  className="bg-black text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}

          {scholarshipStep === 'rejected' && scholarship?.adminComments && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500"><span className="font-medium">Team note:</span> {scholarship.adminComments}</p>
            </div>
          )}
        </div>
      )}

      {/* Discount code — only if no scholarship pending/approved */}
      {!isFreeAfterScholarship && scholarshipStep !== 'submitted' && scholarshipStep !== 'approved' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4 inline mr-1" />
            Discount Code
          </label>
          {discountPreview ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-800 font-medium flex-1">{discountCode.toUpperCase()} applied</span>
              <button onClick={removeDiscount} className="text-xs text-gray-500 hover:text-gray-700 underline">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="flex-1 border-2 text-neutral-500 border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors uppercase"
                placeholder="Enter code"
              />
              <button
                onClick={handleValidateCode}
                disabled={validatingCode || !discountCode.trim()}
                className="px-4 py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {validatingCode ? 'Checking…' : 'Apply'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Card input — only if not free */}
      {!isFreeAfterScholarship && (
        <div className="space-y-4">
          {setupData?.hasSavedCard ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Saved card</p>
                <p className="text-xs text-gray-500 capitalize">
                  {setupData.savedCard.brand} ending in {setupData.savedCard.last4} · {setupData.savedCard.expMonth}/{setupData.savedCard.expYear}
                </p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Card Details *</label>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <CardElement
                  options={{
                    style: {
                      base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#9e2146' },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secured by Stripe. We never store your card details.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handlePay}
        disabled={isSubmitting || (!stripe && !isFreeAfterScholarship)}
        className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing…
          </>
        ) : isFreeAfterScholarship ? (
          'Confirm Enrollment (No Payment Required)'
        ) : (
          `Pay $${(effectiveAmount / 100).toFixed(2)}`
        )}
      </button>
    </div>
  );
};

/* ── wrapper that provides Stripe context ── */
const FellowshipPaymentModal = ({ isOpen, onClose, application, onSuccess }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl">
        <Elements stripe={stripePromise}>
          <PaymentForm
            application={application}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default FellowshipPaymentModal;
