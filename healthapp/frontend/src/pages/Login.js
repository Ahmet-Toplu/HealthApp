// Importing necessary React hooks and Axios for HTTP requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The LoginPage component
export const LoginPage = () => {
  // State hooks for managing email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect hook to set the page title on component mount
  useEffect(() => {
    document.title = 'Login Page'; // Sets the document title to 'Login Page'
  }, []);

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission behavior
    // Makes a POST request to the server with email and password
    axios.post('http://localhost:8081/login', { email, password })
      .then(res => console.log(res)) // Logs the response on success
      .catch(err => console.log(err)); // Logs the error if request fails
  }

  // The component's rendered JSX
  return (
    <div className="container"> {/* Main container */}
      <div className="box"> {/* Box for styling */}
        <div className="title"> {/* Title section */}
          <h1>Welcome to</h1> {/* Heading */}
          <h3>Log in here for existing users</h3> {/* Subheading */}
        </div>
        <div className="auth-box"> {/* Authentication box */}
          {/* Form for user authentication */}
          <form className="user" onSubmit={handleSubmit}>
            <div className="emailp">
              {/* Input field for email */}
              <input
                type="email"
                id="auth-input-group"
                placeholder="email"
                name="email"
                onChange={e => setEmail(e.target.value)}
              />
              <br />
            </div>
            <div className="passp">
              {/* Input field for password */}
              <input
                type="password"
                id="auth-input-group"
                placeholder="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {/* Submit button for the form */}
            <input type="submit" className="submit" value="LOGIN" />
            {/* Link to the registration page */}
            <span className="register-redirect">
              New to CareCompass? Sign up <a href="/register">here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
