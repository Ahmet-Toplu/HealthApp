import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Preferences } from '@capacitor/preferences'; // Import Preferences for storage
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Added state for error message


  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    document.title = 'Login Page';
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://192.168.1.168:8081/login', { email, password })
    .then(async (res) => {
      if (res.data === 'user already exists') {
        setErrorMessage('User already exists. Please try another email.');
      }else if (res.data === 'Email does not exist!') {
        setErrorMessage('Email does not exist!')
      } else if (res.data === 'incorrect pasword') {
        setErrorMessage('incorrect pasword')
      }
       else {
        let userInfo = res.data[0];
        for (const key in userInfo) {
          if (userInfo.hasOwnProperty(key)) {
            await Preferences.set({
                key: key,
                value: JSON.stringify(userInfo[key])
              });
          }
        }
        navigate('/profile'); // Redirect to the profile page
      }
    })
    .catch(err => {
      console.log(err);
      setErrorMessage('An error occurred. Please try again later.');
    });
  }

  return (
    <div className="container mt-5"> {/* Bootstrap container with margin-top */}
      <div className="card"> {/* Bootstrap card component */}
        <div className="card-body"> {/* Card body for padding and content */}
          <h1 className="text-center">Welcome to</h1> {/* Centered text */}
          <h3 className="text-center mb-4">Log in here for existing users</h3> {/* Centered text with margin-bottom */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3"> {/* Bootstrap class for margin-bottom */}
              <input
                type="email"
                className="form-control"
                placeholder="email"
                name="email"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100"> {/* Bootstrap button */}
              LOGIN
            </button>
            <div className="text-center mt-3"> {/* Text centering and margin-top */}
              New to CareCompass? Sign up <a href="/register">here</a>
            </div>
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};
