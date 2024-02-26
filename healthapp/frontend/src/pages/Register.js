import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Preferences } from '@capacitor/preferences'; // Import Preferences for storage
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

export const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Added state for error message

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    document.title = 'Register Page';
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/register', { firstName, lastName, email, password })
      .then(async (res) => {
        if (res.data === 'user already exists') {
          setErrorMessage('User already exists. Please try another email.');
        } else {
          // Assuming the authToken is in res.data.authToken
          await Preferences.set({
            key: 'authToken',
            value: res.data
          });
          navigate('/profile'); // Redirect to the profile page
        }
      })
      .catch(err => {
        console.log(err);
        setErrorMessage('An error occurred. Please try again later.');
      });
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="text-center mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};
