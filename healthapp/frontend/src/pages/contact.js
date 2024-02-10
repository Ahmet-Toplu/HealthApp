import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';

export const ContactPage = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });

    // Wrap fetchContacts with useCallback
    const fetchContacts = useCallback(() => {
        if (location.lat && location.lng) {
            axios.get(`http://localhost:8081/api/contact?lat=${location.lat}&lng=${location.lng}`)
              .then(response => {
                  // Process your response here
                  console.log(response.data);
              })
              .catch(error => {
                  console.error('Error fetching hospitals:', error);
              });
        }
    }, [location.lat, location.lng]); // Dependencies for useCallback

    useEffect(() => {
        const onSuccess = (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
        };

        navigator.geolocation.getCurrentPosition(onSuccess);
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]); // Now fetchContacts is a dependency, but stable thanks to useCallback

    return (
        <div className='mx-3 mt-3'>
            <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
                <h1>404 Page Not Found Contacts</h1>
            </div>
        </div>
    );
};
