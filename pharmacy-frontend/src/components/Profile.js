import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Package } from 'lucide-react';

function Profile({ user, setUser }) {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If nobody is logged in, kick them back to the login page
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch ONLY this specific user's orders from MySQL
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/orders/${user.id}`);
        setUserOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      {/* User Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 flex justify-between items-center text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Package className="mr-2" /> My Order History
      </h3>
      
      {loading ? (
        <div className="text-center py-10 text-gray-500 font-bold">Loading your private history...</div>
      ) : userOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  
                  <span className="font-bold text-gray-900">
                    {new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full mb-1">
                    {order.status}
                  </span>
                  <div className="font-extrabold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm items-center">
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
                      {item.name}
                    </span>
                    <span className="text-gray-500">${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;