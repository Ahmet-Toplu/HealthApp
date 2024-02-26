import React, { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import '../css/Switch.css'; // Make sure to create a Switch.css file with the styles provided after this code block

const Switch = ({ isOn, handleToggle }) => (
    <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <span className="slider round"></span>
    </label>
);

export const SettingsPage = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const { value: notificationsValue } = await Preferences.get({ key: 'notificationsEnabled' });
            const { value: soundValue } = await Preferences.get({ key: 'soundEnabled' });

            if (notificationsValue !== null) {
                setNotificationsEnabled(notificationsValue === 'true');
            }
            if (soundValue !== null) {
                setSoundEnabled(soundValue === 'true');
            }
        };

        loadSettings();
    }, []);

    const toggleNotifications = async () => {
        const newSetting = !notificationsEnabled;
        setNotificationsEnabled(newSetting);
        await Preferences.set({
            key: 'notificationsEnabled',
            value: String(newSetting),
        });
    };

    const toggleSound = async () => {
        const newSetting = !soundEnabled;
        setSoundEnabled(newSetting);
        await Preferences.set({
            key: 'soundEnabled',
            value: String(newSetting),
        });
    };

    return (
        <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ paddingBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Settings</h1>
                <div className="setting">
                    <span>Enable Notifications</span>
                    <Switch isOn={notificationsEnabled} handleToggle={toggleNotifications} />
                </div>
                <div className="setting">
                    <span>Enable Notification Sound</span>
                    <Switch isOn={soundEnabled} handleToggle={toggleSound} />
                </div>
            </div>
        </div>
    );
};
