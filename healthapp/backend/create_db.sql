-- Create the HEALTHAPP database
CREATE DATABASE HEALTHAPP;

-- Switch to the HEALTHAPP database
USE HEALTHAPP;

-- Table to store user information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL,
    username VARCHAR(50),
    phone VARCHAR(15),
    sex ENUM('Male', 'Female', 'Other'),
    blood_type VARCHAR(5),
    skin_type VARCHAR(20),
    weight DECIMAL(5, 2), -- in kilograms
    height DECIMAL(5, 2), -- in centimeters
    address VARCHAR(255)
);

-- Table to store allergies
CREATE TABLE allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table to store medications
CREATE TABLE medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    dosage_form VARCHAR(50),
    frequency VARCHAR(50),
    prescription_required BOOLEAN,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Intersection table to link users with allergies
CREATE TABLE user_allergies (
    user_id INT,
    allergy_id INT,
    PRIMARY KEY (user_id, allergy_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (allergy_id) REFERENCES allergies(id)
);

-- Intersection table to link users with medications
CREATE TABLE user_medications (
    user_id INT NOT NULL,
    medication_id INT NOT NULL,
    PRIMARY KEY (user_id, medication_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Table to store administrative users
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);


-- Forum Table
CREATE TABLE Forum (
    forum_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comment Table
CREATE TABLE Comment (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    forum_id INT,
    user_id INT,
    comment_text TEXT,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES Forum(forum_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Article Table
CREATE TABLE Article (
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    link VARCHAR(255) NOT NULL,
    title TEXT,
    date DATE
);




CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
 GRANT ALL PRIVILEGES ON HEALTHAPP.* TO 'appuser'@'localhost';