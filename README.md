
# 🏥 HealthPlus - Full-Stack Pharmacy E-Commerce System

A complete, responsive e-commerce web application for a pharmacy. This project features secure user authentication, a dynamic shopping cart, real-time secure payment processing, and permanent order history tracking.

## 🚀 Features

* **Secure User Authentication:** Registration and login system using `werkzeug.security` for password hashing.
* **Dynamic Shopping Cart:** Add or remove medicines, view product images, and calculate real-time totals.
* **Real Payment Processing:** Integrated with **Stripe API** and Stripe Elements to securely process credit card transactions without raw card data ever touching the server.
* **Persistent Order History:** Users have private profile pages that query the MySQL database to display only their specific past transactions.
* **Fully Responsive UI:** Built with React and styled to work seamlessly across mobile, tablet, and desktop devices.

## 🛠️ Tech Stack

**Frontend:**
* React.js
* React Router (for navigation)
* Tailwind CSS (for styling)
* Axios (for API requests)
* Stripe Elements (`@stripe/react-stripe-js`)

**Backend:**
* Python / Flask
* Flask-CORS
* Stripe Python SDK
* Werkzeug Security (for password encryption)

**Database:**
* MySQL (connected via `mysql-connector-python`)

---

## 📂 Project Structure

```text
pharmacy-website/
│
├── backend/                        # Flask server & Python backend
│   ├── app.py                      # Main API routing and configuration
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Python Virtual Environment
│       └── database/               
│           └── schema.sql          # MySQL database initialization script
│
├── pharmacy-frontend/              # React frontend application
│   ├── public/                     # Static assets (HTML, manifests)
│   │   └── index.html              # Main HTML entry point
│   │
│   ├── src/                        # React source code
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Cart.js             # Shopping cart and Stripe elements
│   │   │   ├── CheckoutForm.js     # Stripe payment processing form
│   │   │   ├── Login.js            # User authentication & registration
│   │   │   ├── MedicinesList.js    # Storefront product display
│   │   │   └── Profile.js          # Secure user order history
│   │   │
│   │   ├── App.js                  # Main React component and page routing
│   │   ├── App.css                 # Global styling
│   │   ├── index.js                # React application entry point
│   │   └── index.css               # Tailwind CSS imports
│   │
│   ├── package.json                # Node dependencies and project scripts
│   └── tailwind.config.js          # Tailwind CSS styling configuration
│
└── README.md                       # Project documentation and setup guide
```
## 💻 Local Setup Instructions
Follow these steps to get the project running on your local machine.

1. Clone the Repository
Bash
git clone [https://github.com/Krish5102004/pharmacy-website-devops-practice.git](https://github.com/Krish5102004/pharmacy-website-devops-practice.git)
cd pharmacy-website-devops-practice

2. Database Setup (MySQL)
Open MySQL Workbench.

Open the schema.sql file located in the root of the project folder.

Execute the entire script (click the lightning bolt icon). This will automatically create the pharmacy_db database, generate the users, medicines, and orders tables, and populate the store with default medicines.

3. Backend Setup (Flask)
Navigate to the backend folder:

Bash
cd backend
Install the required Python libraries:

Bash
pip install flask flask-cors mysql-connector-python stripe werkzeug
Environment Configuration: Open app.py. Ensure your local MySQL password is set correctly in the get_db_connection() function, and insert your Stripe Test Secret Key (sk_test_...) where indicated.
⚠️ Never push your Stripe Secret Key to a public GitHub repository!

Start the Flask server:

Bash
python app.py
The server will run on http://127.0.0.1:5000

4. Frontend Setup (React)
Open a new terminal window and navigate to the frontend folder:

Bash
cd pharmacy-frontend
Install the Node modules:

Bash
npm install
Stripe Configuration: Open src/components/Cart.js and replace the placeholder string at the top of the file with your Stripe Publishable Key (pk_test_...).

Start the React development server:

Bash
npm start
The website will automatically open in your browser at http://localhost:3000

## 🔒 Security Notes

1. Stripe Compliance: This application uses Stripe PaymentIntents. The server generates a clientSecret, and the React frontend uses Stripe Elements to securely collect payment details. The server never sees or stores raw credit card numbers.
2. Passwords: User passwords are encrypted using SHA-256 hashing before being stored in the MySQL database.
3. API Keys: Always keep your API keys secure. In production, utilize .env files and deployment platform environment variables rather than hardcoding keys into your scripts.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any new features, UI improvements, or bug fixes!
