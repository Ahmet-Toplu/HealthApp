use HEALTHAPP;

-- Insert test data into the users table
INSERT INTO users (first_name, last_name, date_of_birth, email, password, phone, sex, blood_type, skin_type, weight, height, address)
VALUES
    ('ab', 'Dan', '1990-05-15', 'ab@gmail.com', 'password123', 'abc4567890', 'Male', 'A+', 'Normal', 75.5, 180.3, '123 Main St'),
    ('ma', 'hmg', '1985-09-25', 'ma@gmail.com', 'securepass', '9876543abc', 'Female', 'O-', 'Sensitive', 62.0, 165.7, '456 Elm St');

-- Insert test data into the allergies table
INSERT INTO allergies (name, user_id)
VALUES
    ('Peanuts', 1),
    ('Fish', 2);

-- Insert test data into the medications table
INSERT INTO medications (name, dosage, dosage_form, frequency, prescription_required, user_id)
VALUES
    ('Aspirin', '500mg', 'Tablet', 'Once daily', 1, 1),
    ('Allegra', '180mg', 'Tablet', 'Once daily', 1, 2);
