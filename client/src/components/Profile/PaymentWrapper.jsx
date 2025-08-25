// PaymentWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../ExecutiveFellowships/PaymentForm";

const stripePromise = loadStripe("pk_test_51RtF9nQom0p8YmDWYpORq8aJSFZ41I8jJtZAaWclT5hTdS0Br15REB1cMZUkJI2nNbXHdSEuECF320gvOnTYALu100qti58qa3");

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
