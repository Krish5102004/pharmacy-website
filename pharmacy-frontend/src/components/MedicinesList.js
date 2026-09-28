import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

function MedicinesList({ addToCart }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/medicines')
      .then(res => {
        setMedicines(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not connect to the backend server.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading medicines...</div>;
  if (error) return <div className="text-center mt-20 text-xl font-bold text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="bg-blue-50 py-10 md:py-16 px-4 mb-8 md:mb-12 text-center border-b border-blue-100">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 tracking-tight">
          Welcome to HealthPlus Pharmacy
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted neighborhood pharmacy, now online. Browse our top-quality medicines and wellness products delivered straight to your door.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex justify-between items-center mb-6 md:mb-8 border-b pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
        </div>

        {/* This is the magic responsive grid line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {medicines.map(med => (
            <div key={med.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <img 
                src={medicineImages[med.name.trim()] || defaultImage} 
                alt={med.name} 
                className="w-full h-48 md:h-56 object-cover mb-4 md:mb-6 rounded-xl shadow-sm border border-gray-50" 
              />
              <h3 className="text-lg md:text-xl font-bold text-gray-800 w-full text-left line-clamp-1">{med.name}</h3>
              <p className="text-gray-500 text-xs md:text-sm text-left my-2 h-10 w-full line-clamp-2">{med.description}</p>
              
              <div className="w-full flex justify-between items-center mt-auto pt-4">
                <span className="text-xl md:text-2xl font-extrabold text-blue-600">${parseFloat(med.price).toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(med)}
                  className="bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-full hover:bg-blue-700 transition-colors font-bold shadow-md active:transform active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MedicinesList;