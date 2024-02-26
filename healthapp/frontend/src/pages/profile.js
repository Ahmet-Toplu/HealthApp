import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences'; // Corrected import

export const ProfilePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await Preferences.get({ key: 'authToken' }); // Corrected usage
            if (token.value) {
                setIsLoggedIn(true);
            } else {
                // Redirect to login if not authenticated
                navigate('/login');
            }
        };

        checkAuthStatus();
    }, [navigate]);

    const handleLogout = async () => {
        await Preferences.remove({ key: 'authToken' }); // Remove the token
        navigate('/login'); // Redirect to login page
    };

    if (!isLoggedIn) {
        // Optional: render a loading state or null while checking auth status
        return null;
    }

    // Render profile page if logged in
    return (
        <div className='mx-3 mt-3'>
            <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
                <h1>Welcome to Your Profile</h1>
                {/* Profile content goes here */}
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button> {/* Logout Button */}
            </div>
        </div>
    );
};
