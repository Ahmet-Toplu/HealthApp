import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../css/contact.css'; // Import the CSS file

export const ContactPage = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [contacts, setContacts] = useState([]);

    const fetchContacts = useCallback(() => {
        if (location.lat && location.lng) {
            axios.get(`http://localhost:8081/api/contact?lat=${location.lat}&lng=${location.lng}`)
              .then(response => {
                  setContacts(response.data);
              })
              .catch(error => {
                  console.error('Error fetching hospitals:', error);
              });
        }
    }, [location.lat, location.lng]);

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
    }, [fetchContacts]);

    return (
        <div className='mx-3 mt-3'>
            <div className='contact-container'>
                <h1 className='contact-title'>Hospital Contacts</h1>
                <table className='contact-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <tr key={index}>
                                <td>{contact.name}</td>
                                <td className='phone'>{contact.formatted_phone_number}</td>
                                <td>{contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer">{contact.website}</a>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
