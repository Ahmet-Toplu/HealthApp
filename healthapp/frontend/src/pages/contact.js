import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import '../css/chatbot.css'

export const ContactPage = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [contacts, setContacts] = useState([]); // State to store fetched contacts

    // Wrap fetchContacts with useCallback
    const fetchContacts = useCallback(() => {
        if (location.lat && location.lng) {
            axios.get(`http://localhost:8081/api/contact?lat=${location.lat}&lng=${location.lng}`)
              .then(response => {
                  // Process your response here
                  setContacts(response.data);
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
            <div style={{ paddingBottom: '88px', width: '100%' }}>
                <h1>Hospital Contacts</h1>
                {/* Render contacts data */}
                <div>
                    {contacts.map((contact, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <h2>{contact.name}</h2>
                            {contact.formatted_phone_number && <p>Phone: {contact.formatted_phone_number}</p>}
                            {contact.website && <p>Website: <a href={contact.website} target="_blank" rel="noopener noreferrer">{contact.website}</a></p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
