// Import necessary components from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUser, faGears } from '@fortawesome/free-solid-svg-icons';
import { AuthProvider } from './contexts/AuthContext';

// Import your page components
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { MapsPage } from "./pages/map";
import { ChatBotPage } from "./pages/chatbot";
import { ForumPage } from "./pages/forum";
import { ContactPage } from "./pages/contact";
import { ArticlesPage } from "./pages/articles";
import { ProfilePage } from "./pages/profile";
import { NotificationPage } from "./pages/notification";
import { SettingsPage } from "./pages/settings";

// Define the Navigation component
export const Navigation = () => {
    return (
        // Use BrowserRouter to enable routing in your application
        <Router>

            <nav className="navbar navbar-expand navbar-light bg-light fixed-bottom">
                <div className="container-fluid justify-content-center">
                    <div className="navbar-nav justify-content-center">
                    <Link className="nav-item nav-link d-inline mx-2" to="/" title="Home">
                        <FontAwesomeIcon icon={faHome} size="lg" />
                    </Link>
                    <Link className="nav-item nav-link d-inline mx-2" to="/notification" title="Notifications">
                        <FontAwesomeIcon icon={faBell} size="lg" />
                    </Link>
                    <Link className="nav-item nav-link d-inline mx-2" to="/profile" title="Profile">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                    </Link>
                    <Link className="nav-item nav-link d-inline mx-2" to="/settings" title="Settings">
                        <FontAwesomeIcon icon={faGears} size="lg" />
                    </Link>
                    </div>
                </div>
            </nav>


            <AuthProvider>
                {/* Define the Routes for different paths */}
                <Routes>
                    {/* Route for the home page (path: /) */}
                    <Route exact path="/" element={<HomePage />} />

                    {/* Route for the login page (path: /Login) */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Route for the register page (path: /Register) */}
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route path="/map" element={<MapsPage />} />

                    <Route path="/chatbot" element={<ChatBotPage />} />
                    
                    <Route path="/forum" element={<ForumPage />} />

                    <Route path="/contact" element={<ContactPage />} />

                    <Route path="/articles" element={<ArticlesPage />} />

                    <Route path="/profile" element={<ProfilePage />} />
                    
                    <Route path="/notification" element={<NotificationPage />} />

                    <Route path="/settings" element={<SettingsPage />} />


                    {/* 
                    Catch-all Route: 
                    If the path doesn't match any of the above, display the not found page
                    */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};
