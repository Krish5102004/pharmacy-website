import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse } from 'lucide-react';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      if (isLogin) {
        // Real Login Request to Flask
        const res = await axios.post('http://13.201.18.67:5000/api/login', {
          email: formData.email,
          password: formData.password
        });
        
        setUser(res.data); // Saves the user object (with ID) to App state
      } else {
        // Real Registration Request to Flask
        const res = await axios.post('http://13.201.18.67:5000/api/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        setUser(res.data);
      }
      
      // Redirect to home page upon successful login/registration
      navigate('/');
      
    } catch (err) {
      // Catch errors sent back by Flask (like "Invalid password" or "Email already exists")
      setAuthError(err.response?.data?.error || "Connection failed. Is your backend running?");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-6 text-center">
          <HeartPulse size={40} className="mx-auto text-blue-200 mb-2" />
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
        </div>
        
        <div className="p-8">
          {authError && (
            <div className="mb-4 text-red-500 text-sm font-bold p-3 bg-red-50 rounded border border-red-100">
              {authError}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 mt-4 transition shadow-md active:scale-95"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { 
                setIsLogin(!isLogin); 
                setAuthError(''); 
                setFormData({ name: '', email: '', password: '' }); 
              }} 
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign up here' : 'Log in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
