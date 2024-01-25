export default function Login() {
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
              <form class="user" action="/home" method="post">
                <div class="emailp">
                  <input
                    type="email"
                    id="auth-input-group"
                    placeholder="email"
                    name="email"
                  />
                  <br />
                </div>
                <div class="passp">
                  <input
                    type="password"
                    id="auth-input-group"
                    placeholder="password"
                    name="password"
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
