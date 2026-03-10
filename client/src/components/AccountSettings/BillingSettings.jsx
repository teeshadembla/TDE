import React, { useState, useEffect, useContext } from 'react';
import { CreditCard, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../../config/apiConfig.js';

const stripePromise = loadStripe("pk_test_51RtF9nQom0p8YmDWYpORq8aJSFZ41I8jJtZAaWclT5hTdS0Br15REB1cMZUkJI2nNbXHdSEuECF320gvOnTYALu100qti58qa3");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#111827',
      fontFamily: '"DM Sans", sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
  hidePostalCode: false,
};

// Inner form using Stripe hooks
const UpdateCardForm = ({ user, savedCard, onCardUpdated }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!savedCard);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      // Create a setup intent on the backend
      const { data } = await axiosInstance.post('/api/fellowship/registration/create-setup-intent', {
        userId: user._id
      });

      const { error, setupIntent } = await stripe.confirmCardSetup(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.FullName || '',
            email: user?.email || ''
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Notify backend to save the new default payment method
      await axiosInstance.post('/api/user/update-payment-method', {
        userId: user._id,
        paymentMethodId: setupIntent.payment_method
      });

      toast.success('Payment method updated successfully');
      setIsEditing(false);
      if (onCardUpdated) onCardUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment method');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing && savedCard) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-16 items-center justify-center rounded-md bg-gray-900">
              <CreditCard size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {savedCard.brand?.charAt(0).toUpperCase() + savedCard.brand?.slice(1)} •••• {savedCard.last4}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Expires {savedCard.exp_month?.toString().padStart(2, '0')}/{savedCard.exp_year}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle size={11} /> Active
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div className="flex gap-3">
        {savedCard && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <><RefreshCw size={14} className="animate-spin" /> Saving...</>
          ) : (
            <><CreditCard size={14} /> Save Payment Method</>
          )}
        </button>
      </div>
    </form>
  );
};

const BillingSettings = ({ user }) => {
  const [savedCard, setSavedCard] = useState(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [billingHistory, setBillingHistory] = useState([]);

  const fetchPaymentInfo = async () => {
    if (!user?._id) return;
    setIsLoadingCard(true);
    try {
      const { data } = await axiosInstance.get(`/api/user/payment-method/${user._id}`);
      setSavedCard(data.paymentMethod || null);
    } catch (err) {
      // No payment method saved yet — that's fine
      setSavedCard(null);
    } finally {
      setIsLoadingCard(false);
    }
  };

  useEffect(() => {
    fetchPaymentInfo();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Billing & Payments</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your payment method for fellowship billing</p>
      </div>

      {/* Security notice */}
      <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700">
          Your payment details are securely stored by Stripe. We never see or store your full card number.
          Your card will only be charged upon fellowship approval.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Payment Method</h3>
        {isLoadingCard ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <RefreshCw size={14} className="animate-spin" /> Loading payment info...
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <UpdateCardForm user={user} savedCard={savedCard} onCardUpdated={fetchPaymentInfo} />
          </Elements>
        )}
      </section>

      {/* Billing info note */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">About Billing</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Fellowship fees are charged automatically upon application approval for your selected cycle.</p>
          <p>For billing inquiries, refunds, or disputes, please contact our support team directly.</p>
        </div>
      </section>
    </div>
  );
};

export default BillingSettings;