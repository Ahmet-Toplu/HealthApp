// Import necessary components from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your page components
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";

// Define the Navigation component
export const Navigation = () => {
    return (
        // Use BrowserRouter to enable routing in your application
        <Router>

            <nav className="navbar navbar-expand navbar-light bg-light">
            <   div className="container-fluid justify-content-center">
                    {/* Centered navigation links */}
                    <div className="navbar-nav justify-content-center">
                        <Link className="nav-item nav-link d-inline mx-2" to="/">Home</Link>
                        <Link className="nav-item nav-link d-inline mx-2" to="/login">Login</Link>
                        <Link className="nav-item nav-link d-inline mx-2" to="/register">Register</Link>
                    </div>
                </div>
            </nav>

            {/* Define the Routes for different paths */}
            <Routes>
                {/* Route for the home page (path: /) */}
                <Route path="/" element={<HomePage />} />

                {/* Route for the login page (path: /Login) */}
                <Route path="/login" element={<LoginPage />} />

                {/* Route for the register page (path: /Register) */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 
                  Catch-all Route: 
                  If the path doesn't match any of the above, display the not found page
                */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
