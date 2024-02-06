import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const HospitalMarker = ({ text }) => <div style={{ color: 'red' }}>{text}</div>;
const UserLocationMarker = ({ text }) => <div style={{ color: 'blue' }}>{text}</div>;

export const MapsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(null);

  // Simulate fetching hospitals
  const fetchHospitals = (location) => {
    const { lat, lng } = location;
    // Replace with your actual fetch logic
    axios.get(`http://localhost:8081/api/hospitals?lat=${lat}&lng=${lng}`)
      .then(response => {
        setHospitals(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(pos);
        fetchHospitals(pos);
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (userLocation) {
        // Add user location marker if userLocation is available
        new window.google.maps.Marker({
          position: userLocation,
          map: mapRef.current,
          title: 'Your Location',
        });
      }
      hospitals.forEach((hospital) => {
        new window.google.maps.Marker({
          position: {
            lat: hospital.geometry.location.lat,
            lng: hospital.geometry.location.lng
          },
          map: mapRef.current,
          title: hospital.name,
        });
      });
    }
  }, [userLocation, hospitals]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={userLocation || { lat: 59.95, lng: 30.33 }} // Fallback to a default center if userLocation is null
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        
        {userLocation && (
          <UserLocationMarker
            lat={userLocation.lat}
            lng={userLocation.lng}
            text="Your Location"
          />
        )}

        {hospitals.map((hospital, index) => (
          <HospitalMarker
            key={index}
            lat={hospital.geometry.location.lat}
            lng={hospital.geometry.location.lng}
            text={hospital.name}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};
