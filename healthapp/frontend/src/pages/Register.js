// Import necessary React hooks and the CSS file for styling
import React, { useState, useEffect } from 'react';
import axios from 'axios';


// The Register component
export const RegisterPage = () => {
  // State hooks for managing email and password inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect hook to set the page title when the component mounts
  useEffect(() => {
    document.title = 'Register Page'; // Sets the document title to 'Register Page'
  }, []);

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission behavior
    // Makes a POST request to the server with email and password
    axios.post('http://localhost:8081/register', { firstName, lastName, email, password })
      .then(res => console.log(res)) // Logs the response on success
      .catch(err => console.log(err)); // Logs the error if request fails
  }

  // Render method returns the JSX for the component
  return (
    <div className="container"> {/* Main container for the form */}
      <div className="box"> {/* Box for styling */}
        <div className="title"> {/* Title section */}
          <h1>Welcome to</h1> {/* Main heading */}
          <h3>Register here for new users</h3> {/* Subheading */}
        </div>
        <div className="auth-box"> {/* Box for the form elements */}
          {/* The form for registration */}
          <form className="user" onSubmit={handleSubmit}>
            <div className="firstName">
              {/* Input field for the first name */}
              <input
                type="text"
                id="auth-input-group"
                placeholder="first name"
                name="firstName"
                onChange={e => setFirstName(e.target.value)}
              />
              <br />
            </div>
            <div className="lastName">
              {/* Input field for the last name */}
              <input
                type="text"
                id="auth-input-group"
                placeholder="last name"
                name="lastName"
                onChange={e => setLastName(e.target.value)}
              />
              <br />
            </div>
            <div className="email">
              {/* Input field for the email */}
              <input
                type="email"
                id="auth-input-group"
                placeholder="email"
                name="email"
                onChange={e => setEmail(e.target.value)}
              />
              <br />
            </div>
            <div className="password">
              {/* Input field for the password */}
              <input
                type="text"
                id="auth-input-group"
                placeholder="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {/* Submit button for the form */}
            <button type="submit" className="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
