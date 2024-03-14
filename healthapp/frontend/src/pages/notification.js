import React, { useEffect, useState, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

export const NotificationPage = () => {
    const [userId, setUserId] = useState('');
    const [scheduledNotifications, setScheduledNotifications] = useState([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true); // New state for notifications preference
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({
        name: '',
        dosage: '',
        dosage_form: '',
        frequency: ''
    });

    useEffect(() => {
        LocalNotifications.requestPermissions();
    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            const { value } = await Preferences.get({ key: 'id' });
            if (value) {
                setUserId(value);
            }

            // Fetch and set the notifications enabled preference
            const notificationsPref = await Preferences.get({ key: 'notificationsEnabled' });
            setNotificationsEnabled(notificationsPref.value !== 'false'); // false if the setting is 'false', true otherwise
        };

        fetchSettings();
    }, []);

    const fetchAndScheduleNotifications = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await fetch('localhost:8081/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            await scheduleNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchAndScheduleNotifications();
        }
    }, [userId, fetchAndScheduleNotifications]);

    const scheduleNotifications = async (medications) => {
        // Fetch preferences for notifications and sound
        const { value: notificationsEnabled } = await Preferences.get({ key: 'notificationsEnabled' });
        const { value: soundEnabled } = await Preferences.get({ key: 'soundEnabled' });
    
        // Check if notifications are enabled before proceeding
        if (notificationsEnabled === 'false') {
            return;
        }
    
        const notificationsToSchedule = medications.map((item) => {
            const notification = {
                title: `Time for your medicine: ${item.name}`,
                body: `Dosage: ${item.dosage} ${item.dosage_form}, Frequency: ${item.frequency} times a day`,
                id: item.id,
                schedule: { at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) }, // Schedule for the next day
            };
    
            // Include sound only if enabled
            if (soundEnabled === 'true') {
                notification.sound = 'notification_sound.wav';
            }
    
            return notification;
        });
    
        if (notificationsToSchedule.length > 0) {
            await LocalNotifications.schedule({ notifications: notificationsToSchedule });
    
            setScheduledNotifications(notificationsToSchedule.map(notification => ({
                id: notification.id,
                title: notification.title,
                frequency: notification.body
            })));
    
            await Preferences.set({
                key: 'scheduledNotifications',
                value: JSON.stringify(notificationsToSchedule),
            });
        }
    };
    


    const deleteNotification = async (notificationId) => {
        try {
            // Delete the notification from the server
            const response = await fetch(`http://localhost:8081/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete notification.');
            }
    
            // Remove the deleted notification from state
            setScheduledNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    
            // Clear scheduled notification from preferences
            const updatedNotifications = scheduledNotifications.filter(notification => notification.id !== notificationId);
            await Preferences.set({
                key: 'scheduledNotifications',
                value: JSON.stringify(updatedNotifications),
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotification(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addNotification = async () => {
        try {
            const notificationData = {
                ...newNotification,
                userId: userId
            };

            const response = await fetch(`http://localhost:8081/api/addNotification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data === "added") {
                setNewNotification({
                    name: '',
                    dosage: '',
                    dosage_form: '',
                    frequency: ''
                });
                setIsModalOpen(false);
            }

            // Refresh the scheduled notifications list
            await fetchAndScheduleNotifications();
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };
    

    return (
        <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
                <h1>Notifications Page</h1>
                <button onClick={() => setIsModalOpen(true)}>Add Notification</button>
                {scheduledNotifications.length > 0 ? (
                    <ul>
                        {scheduledNotifications.map((notification, index) => (
                            <li key={index}>
                                {`${notification.title} - Frequency: ${notification.frequency}`}
                                <button onClick={() => deleteNotification(notification.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    notificationsEnabled ? (
                        <p>No notifications scheduled yet.</p>
                    ) : (
                        <p>Notifications are turned off.</p>
                    )
                )}
                {isModalOpen && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', zIndex: 100 }}>
                        <h2>Add New Notification</h2>
                        <input type="text" placeholder="Medication Name" name="name" value={newNotification.name} onChange={handleInputChange} />
                        <input type="text" placeholder="Dosage" name="dosage" value={newNotification.dosage} onChange={handleInputChange} />
                        <input type="text" placeholder="Dosage Form" name="dosage_form" value={newNotification.dosage_form} onChange={handleInputChange} />
                        <input type="number" placeholder="Frequency" name="frequency" value={newNotification.frequency} onChange={handleInputChange} />
                        <button onClick={addNotification}>Submit</button>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};