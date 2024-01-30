import React, { useState } from 'react';
import axios from 'axios';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('')
  }

  return (
    <div>
      <head>
        {/*Link to the CSS files for styling*/}
        <link rel="stylesheet" href="/stylesheets/register.css" />
        <title>login page</title>
      </head>
      <body>
        <div class="container">
          <div class="box">
            <div class="title">
              <h1>Welcome to </h1>
              <h3>Log in here for existing users</h3>
            </div>
            <div class="auth-box">
              <form class="user" onSubmit={handleSubmit}>
                <div class="emailp">
                  <input
                    type="email"
                    id="auth-input-group"
                    placeholder="email"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                  />
                  <br />
                </div>
                <div class="passp">
                  <input
                    type="password"
                    id="auth-input-group"
                    placeholder="password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <input type="submit" class="submit" value="LOGIN" />
                <span class="register-redirect">
                  New to CareCompass? Sign up <a href="/register">here</a>
                </span>
              </form>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}
