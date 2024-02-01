import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = 'Login Page';
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', { email, password })
      .then(res => console.log(res))
      .catch(err => console.log(err));
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
          </form>
        </div>
      </div>
    </div>
  );
};
