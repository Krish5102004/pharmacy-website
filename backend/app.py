from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import stripe
import json
from werkzeug.security import generate_password_hash, check_password_hash

# 1. THIS MUST COME FIRST: We create the 'app' variable
app = Flask(__name__)
CORS(app)

# 2. CONFIGURATION
# Replace this with your REAL Stripe Secret Key
stripe.api_key = stripe.api_key = "sk_test_YOUR_SECRET_KEY_HERE"

def get_db_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="!Qa1@Ws2#Ed3", # Replace with your MySQL password
            database="pharmacy_db"
        )
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return None

# 3. ROUTES (Now that 'app' exists, we can attach routes to it)

@app.route('/api/medicines', methods=['GET'])
def get_medicines():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM medicines")
    medicines = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return jsonify(medicines)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor()
    
    try:
        hashed_pw = generate_password_hash(data['password'])
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (data['name'], data['email'], hashed_pw)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({"id": user_id, "name": data['name'], "email": data['email']})
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], data['password']):
            return jsonify({"id": user['id'], "name": user['name'], "email": user['email']})
        
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/orders', methods=['POST'])
def save_order():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor()
    
    try:
        items_json = json.dumps(data['items'])
        cursor.execute(
            "INSERT INTO orders (user_id, total_amount, status, items) VALUES (%s, %s, %s, %s)",
            (data['user_id'], data['total'], data['status'], items_json)
        )
        conn.commit()
        return jsonify({"message": "Order saved permanently!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Fetch only the orders belonging to this specific user ID
        cursor.execute("SELECT * FROM orders WHERE user_id = %s ORDER BY id DESC", (user_id,))
        orders = cursor.fetchall()
        
        # Convert the JSON strings back into readable lists for React
        for order in orders:
            if isinstance(order['items'], str):
                order['items'] = json.loads(order['items'])
                
        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = request.json
        amount_in_cents = int(float(data['total']) * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency='usd',
            automatic_payment_methods={'enabled': True},
        )
        return jsonify({'clientSecret': intent['client_secret']})
    except Exception as e:
        return jsonify(error=str(e)), 403

# 4. RUN THE SERVER
if __name__ == '__main__':
    app.run(debug=True)