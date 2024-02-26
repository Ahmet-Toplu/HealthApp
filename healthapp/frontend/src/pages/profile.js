import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

export const ProfilePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await Preferences.get({ key: 'id' });
            if (token.value) {
                setIsLoggedIn(true);
                await fetchAllUserInfo();
            } else {
                navigate('/login');
            }
        };

        const fetchAllUserInfo = async () => {
            let allUserInfo = {};
            // Assuming you know the keys you have saved; otherwise, it's hard to enumerate keys with Preferences
            const keysToFetch = ['username', 'first_name', 'last_name', 'email', 'date_of_birth', 'phone', 'sex', 'blood_type', 'skin_type', 'weight', 'height', 'address']; // Add more keys as needed
            for (const key of keysToFetch) {
                const value = await Preferences.get({ key: key });
                if (value.value) {
                    allUserInfo[key] = JSON.parse(value.value); // Parse since you stored them as JSON strings
                }
            }
            setUserInfo(allUserInfo);
            setIsLoading(false);
        };

        checkAuthStatus();
    }, [navigate]);

    const handleLogout = async () => {
        await Preferences.clear(); // Clear all data
        navigate('/login');
    };

    if (!isLoggedIn || isLoading) {
        return <div>Loading...</div>; // Display while loading
    }

    // Render user information
    return (
        <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
                <h1>Welcome to Your Profile</h1>
                {/* Dynamically display user information */}
                {Object.entries(userInfo).map(([key, value]) => (
                    <p key={key}>{`${key}: ${value}`}</p>
                ))}
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};
