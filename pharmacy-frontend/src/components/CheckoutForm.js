import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

function CheckoutForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // NEW: State to track when Stripe's iframe has actually finished mounting
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Guard clause: prevent submission unless Stripe is fully mounted and ready
    if (!stripe || !elements || !isReady) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      
      {/* Tell React to set isReady to true ONLY when Stripe confirms it is mounted */}
      <PaymentElement 
        className="mb-6" 
        onReady={() => setIsReady(true)} 
      />
      
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-100">
          {errorMessage}
        </div>
      )}
      
      {/* Lock the button using our new isReady state */}
      <button 
        type="submit"
        disabled={!stripe || !elements || !isReady || isProcessing} 
        className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${
          (!stripe || !elements || !isReady || isProcessing) 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
        }`}
      >
        {isProcessing ? "Processing..." : !isReady ? "Loading Secure Checkout..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default CheckoutForm;
