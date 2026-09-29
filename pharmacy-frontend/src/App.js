import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User, HeartPulse } from 'lucide-react';
import MedicinesList from './components/MedicinesList';
import Cart from './components/Cart';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const addToCart = (medicine) => {
    setCart([...cart, medicine]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const placeOrder = (totalAmount) => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: totalAmount,
      items: [...cart]
    };
    setOrders([newOrder, ...orders]);
    setCart([]); 
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between h-14 md:h-16 items-center">
              <Link to="/" className="flex items-center space-x-1 md:space-x-2 text-xl md:text-2xl font-bold tracking-tight">
                <HeartPulse size={24} className="text-white md:w-7 md:h-7" />
                <span className="hidden sm:inline">HealthPlus</span>
              </Link>
              
              <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base">
                <Link to="/" className="font-medium hover:text-blue-200 transition">Home</Link>
                
                <Link to="/cart" className="relative flex items-center font-medium hover:text-blue-200 transition">
                  <ShoppingCart size={18} className="mr-1 md:w-5 md:h-5" />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {user ? (
                  <Link to="/profile" className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-full transition shadow-sm">
                    <User size={16} className="md:w-4 md:h-4" />
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition shadow-sm">
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-4 md:pt-8">
          <Routes>
            <Route path="/" element={<MedicinesList addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} user={user} placeOrder={placeOrder} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} orders={orders} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
