// PaymentWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../ExecutiveFellowships/PaymentForm";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper = ({ formData, onPaymentSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        formData={formData}
        onPaymentSuccess={onPaymentSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default PaymentWrapper;
