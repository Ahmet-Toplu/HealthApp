import React, { useState } from 'react';
import axios from 'axios';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', {email, password})
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  return (
    <div className="container">
      <div className="box">
        <div className="title">
          <h1>Welcome to</h1>
          <h3>Log in here for existing users</h3>
        </div>
        <div className="auth-box">
          <form className="user" onSubmit={handleSubmit}>
            <div className="emailp">
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
              <input
                type="password"
                id="auth-input-group"
                placeholder="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <input type="submit" className="submit" value="LOGIN" />
            <span className="register-redirect">
              New to CareCompass? Sign up <a href="/register">here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

