import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, CheckCircle, ChevronLeft, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to put YOUR real publishable key here again!
const stripePromise = loadStripe('STRIPE_PUBLIC_KEY');

// The image dictionary to keep images consistent across the site
const medicineImages = {
  "Paracetamol": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80",
  "Amoxicillin": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  "Vitamin C": "https://images.unsplash.com/photo-1582436855071-77bba6632402?w=400&q=80",
  "Cough Syrup": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80",
  "Ibuprofen": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80",
  "Digital Thermometer": "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80",
  "First Aid Kit": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
  "Antacid Tablets": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80",
  "Allergy Relief": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80",
  "Eye Drops": "https://images.unsplash.com/photo-1618355635391-7f8e815e1bc6?w=400&q=80"
};

const defaultImage = "https://images.unsplash.com/photo-1550572017-ed3c2df28330?w=400&q=80";

function Cart({ cart, removeFromCart, user, placeOrder }) {
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleProceedToPayment = async () => {
    if (!user) {
      setError('Please log in or create an account to proceed with checkout.');
      return;
    }
    
    try {
      const response = await axios.post('http://13.201.18.67:5000/api/create-payment-intent', { total });
      setClientSecret(response.data.clientSecret);
      setCheckoutStep('payment');
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError("Could not connect to payment gateway.");
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Send the order to MySQL
      await axios.post('http://13.201.18.67:5000/api/orders', {
        user_id: user.id, // We get this from the new login system
        total: total,
        status: 'Paid',
        items: cart
      });
      
      setCheckoutStep('success');
      placeOrder(total); // This just clears the frontend cart now
    } catch (err) {
      console.error("Failed to save order to database", err);
      setError("Payment succeeded, but failed to record order history.");
    }
  };

  if (checkoutStep === 'success') {
    return (
      <div className="mx-4 md:max-w-lg md:mx-auto mt-10 md:mt-16 p-6 md:p-8 bg-white rounded-2xl shadow-lg text-center border border-green-100">
        <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
          <CheckCircle size={32} className="text-green-600 md:w-10 md:h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">Your real transaction is complete and medicines are being prepared.</p>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full shadow-md"
        >
          View Order History
        </button>
      </div>
    );
  }

  if (checkoutStep === 'payment' && clientSecret) {
    const options = { clientSecret };
    return (
      <div className="max-w-lg mx-4 md:mx-auto mt-6 md:mt-10">
        <button onClick={() => setCheckoutStep('cart')} className="flex items-center text-blue-600 font-medium hover:text-blue-800 mb-6 transition">
          <ChevronLeft size={20} className="mr-1" /> Back to Cart
        </button>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Secure Checkout</h2>
        
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm total={total} onSuccess={handlePaymentSuccess} />
        </Elements>
      </div>
    );
  }

  // Standard Cart View with Images
  if (cart.length === 0) {
    return <div className="text-center mt-20 text-xl md:text-2xl font-bold text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-4 md:mx-auto mt-6 md:mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 border-b pb-4">Shopping Cart</h2>
      
      <div className="space-y-3 md:space-y-4">
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 md:p-4 rounded border hover:shadow-sm transition-shadow">
            
            {/* The restored image section */}
            <div className="flex items-center w-full">
              <img 
                src={medicineImages[item.name.trim()] || defaultImage} 
                alt={item.name} 
                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md border border-gray-200 mr-3 md:mr-4 shadow-sm flex-shrink-0"
              />
              <div className="flex-grow">
                <h3 className="text-base md:text-xl font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                <p className="text-sm md:text-base text-gray-500 font-medium">${parseFloat(item.price).toFixed(2)}</p>
              </div>
            </div>
            
            <button 
              onClick={() => removeFromCart(index)}
              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors ml-2 flex-shrink-0"
            >
              <Trash2 size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <span className="text-xl md:text-2xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl md:text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 md:p-4 bg-red-50 text-red-600 text-sm md:text-base rounded-lg flex items-start border border-red-100">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0 md:w-5 md:h-5" />
            <span>{error} <button onClick={() => navigate('/login')} className="underline font-bold">Log in here</button>.</span>
          </div>
        )}
        
        <button 
          onClick={handleProceedToPayment}
          className="w-full py-3 md:py-4 rounded-lg text-lg md:text-xl font-bold text-white transition bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.98]"
        >
          Proceed to Secure Payment
        </button>
      </div>
    </div>
  );
}

export default Cart;
