import { LocalNotifications } from '@capacitor/local-notifications';
import React, { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

export const NotificationPage = () => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        LocalNotifications.requestPermissions()
      }, []);      

    // Fetch userId from Preferences
    useEffect(() => {
        const fetchId = async () => {
            const { value } = await Preferences.get({ key: 'id' });
            if (value) {
                setUserId(value);
            }
        };

        fetchId();
    }, []);

    // Fetch notifications and schedule them
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userId) return; // Guard clause if userId is somehow still not set

            try {
                const response = await fetch('http://localhost:8081/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }), // Use the updated userId
                });
                const data = await response.json(); // Assuming your server responds with JSON

                // Schedule notifications based on the data received
                data.forEach((item, index) => {
                    LocalNotifications.schedule({
                        notifications: [
                            {
                                title: `Time for your medicine: ${item.name}`,
                                body: `Dosage: ${item.dosage} ${item.dosage_form}, Frequency: ${item.frequency} times a day`,
                                id: item.id,
                                schedule: { at: new Date(Date.now() + 1000 * 10) }, // Example scheduling, adjust as needed
                                sound: 'notification_sound.wav',
                                attachments: null,
                                actionTypeId: "",
                                extra: null
                            }
                        ]
                    });
                });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (userId) {
            fetchNotifications();
        }
    }, [userId]); // Depend on userId

    return (
        <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
                <h1>Notifications Page</h1>
                {/* Render notifications or a loading message here */}
            </div>
        </div>
    );
};
