import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import '../css/profile.css';

// Updated to handle input changes and onBlur validation
export const ProfilePage = () => {
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [userInput, setUserInput] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await Preferences.get({ key: 'id' });
            if (token.value) {
                setIsLoggedIn(true);
                setUserId(token.value)
                await fetchAllUserInfo();
            } else {
                navigate('/login');
            }
        };
    
        const fetchAllUserInfo = async () => {
            let allUserInfo = {};
            const keysToFetch = ['first_name', 'last_name', 'date_of_birth', 'email', 'username', 'phone', 'sex', 'blood_type', 'skin_type', 'weight', 'height', 'address'];
            for (const key of keysToFetch) {
                const value = await Preferences.get({ key: key });
                // Check for null value and replace with empty string
                allUserInfo[key] = value.value ? JSON.parse(value.value) : "";
            }
            setUserInfo(allUserInfo);
            setIsLoading(false);
        };        
    
        checkAuthStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Ignoring the exhaustive-deps rule warning

    const formatLabel = (key) => {
        return key
            // Insert a space before all caps and capitalize the first letter
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            // Remove underscores, capitalize following letter and trim
            .replace(/_/g, ' ')
            .trim();
    };

    const handleLogout = async () => {
        await Preferences.clear();
        navigate('/login');
    };

    const handleInputChange = (key, value) => {
        // Only update if the current value is null or undefined
        if (userInfo[key] === null || userInfo[key] === undefined) {
            setUserInput({ ...userInput, [key]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit action
        setIsLoading(true); // Show loading indication
        try {
            const data = {
                ...userInfo,
                ...userInput, 
                userId: userId
            }
            const response = await fetch('http://www.doc.gold.ac.uk/usr/701:8081/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers such as authorization if needed
                },
                body: JSON.stringify(data), // Send userInput as JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle response here if needed
            const updatedUserInfo = await response.json();

            delete updatedUserInfo[0].password; // Remove password
            delete updatedUserInfo[0].id; // Remove id

            const keysToClear = Object.keys(userInfo);
            for (const key of keysToClear) {
                await Preferences.remove({ key: key });
            }

            // Set new user info in preferences
            for (const [key, value] of Object.entries(updatedUserInfo[0])) {
                await Preferences.set({
                    key: key,
                    value: JSON.stringify(value), // Assuming the values need to be stringified
                });
            }

            setUserInfo(updatedUserInfo[0]); // Update userInfo state with new data
            setUserInput({}); // Optionally clear userInput if no longer needed
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to update profile.');
        } finally {
            setIsLoading(false); // Hide loading indication
        }
    };

    if (!isLoggedIn || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ paddingBottom: '100px', width: '100%' }}>
                <h1>Welcome to Your Profile</h1>
                <form className="form-container" onSubmit={handleSubmit}>
                    {Object.keys(userInfo).map((key) => (
                        <div key={key} className="form-group">
                            <label className="label">{formatLabel(key)}</label>
                            <input
                                type="text"
                                className="input"
                                value={userInput[key] ?? userInfo[key] ?? ""}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                disabled={userInfo[key] !== null && userInfo[key] !== undefined}
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};
