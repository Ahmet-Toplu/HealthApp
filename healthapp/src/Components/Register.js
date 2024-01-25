export default function Register() {
  return (
    <div>
      <head>
        {/*Link to the CSS files for styling*/}
        <link rel="stylesheet" href="/stylesheets/register.css" />
        <title> register page</title>
      </head>
      <body>
        <div class="container">
          <div class="box">
            <div class="title">
              {/*Dynamic title*/}
              <h1>Welcome to </h1>
              <h3>Register here for new users</h3>
            </div>
            <div class="auth-box">
              {/*registry form split into divs for styling and uses post to save data to db*/}
              <form class="user" action="/registered" method="post">
                {/*Input field for the first name*/}
                <div class="firstName">
                  <input
                    type="text"
                    id="auth-input-group"
                    placeholder="first name"
                    name="firstName"
                    required
                  />
                  <br />
                </div>
                {/*Input field for the last name*/}
                <div class="lastName">
                  <input
                    type="text"
                    id="auth-input-group"
                    placeholder="last name"
                    name="lastName"
                    required
                  />
                  <br />
                </div>
                {/*Input field for the email*/}
                <div class="emailp">
                  <input
                    type="email"
                    id="auth-input-group"
                    placeholder="email"
                    name="email"
                    required
                  />
                  <br />
                </div>
                {/*Input field for the password*/}
                <div class="passp">
                  <input
                    type="text"
                    id="auth-input-group"
                    placeholder="password"
                    name="password"
                    required
                  />
                </div>
                <button type="submit" class="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}
