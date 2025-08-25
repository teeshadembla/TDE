import React, { useContext, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from "react-toastify";
import axiosInstance from "../../config/apiConfig.js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DataProvider from '../../context/DataProvider.jsx';
import { useEffect } from 'react';

const stripePromise = loadStripe("pk_test_51RtF9nQom0p8YmDWYpORq8aJSFZ41I8jJtZAaWclT5hTdS0Br15REB1cMZUkJI2nNbXHdSEuECF320gvOnTYALu100qti58qa3");

// Payment form component
const PaymentForm = ({ formData, onPaymentSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { account } = useContext(DataProvider.DataContext);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found. Please refresh and try again.");
      return;
    }

    setLoading(true);

    try {
      // Create PaymentIntent from your backend
      const { data } = await axiosInstance.post(
        `/api/fellowship/registration/create-payment-intent`,
        {
          ...formData,
          userId: account?._id || formData.userId,
        }
      );

      if (!data.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: account?.name || formData.name || '',
            email: account?.email || formData.email || ''
          }
        }
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment success with backend and submit application
        const result = await axiosInstance.post("/api/fellowship/registration/verifypayment", {
          ...formData,
          paymentIntentId: paymentIntent.id,
          userId: account?._id || formData.userId,
        });
        
        if (result.data.success) {
          toast.success("Payment successful! Application submitted.");
          onPaymentSuccess(paymentIntent.id);
        } else {
          toast.error("Payment succeeded but application submission failed. Please contact support.");
        }
      } else {
        toast.error("Payment was not completed successfully.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium mb-4">Payment Information</h4>
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
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={handlePayment}
          disabled={!stripe || loading}
          className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "Processing Payment..." : "Pay $50 & Submit Application"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;