// Import necessary components from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { LoginPage } from "./pages/Login";

// Define the Navigation component
export const Navigation = () => {
    return (
        // Use BrowserRouter to enable routing in your application
        <Router>
            {/* Define the Routes for different paths */}
            <Routes>
                {/* Route for the home page (path: /) */}
                <Route path="/" element={<HomePage />} />

                {/* Route for the login page (path: /Login) */}
                <Route path="/Login" element={<LoginPage />} />

                {/* 
                  Catch-all Route: 
                  If the path doesn't match any of the above, display the not found page
                */}
                <Route element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};