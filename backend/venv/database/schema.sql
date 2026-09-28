-- schema.sql

CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Create Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Paid',
    items JSON NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Populate Medicines Table with default items
INSERT INTO medicines (name, price) VALUES
('Paracetamol', 5.99),
('Amoxicillin', 12.50),
('Vitamin C', 8.99),
('Cough Syrup', 7.25),
('Ibuprofen', 6.49),
('Digital Thermometer', 15.00),
('First Aid Kit', 25.00),
('Antacid Tablets', 4.50),
('Allergy Relief', 11.20),
('Eye Drops', 9.75);