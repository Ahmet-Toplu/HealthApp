import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@capacitor/google-maps';

const mapContainerStyle = {
  height: 'calc(100vh - 100px)',
  width: '100%',
};

export const MapsPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

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
    let watchId = null;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(pos);
          fetchHospitals(pos);
        },
        (err) => {
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    // Clean up the watchPosition listener when the component is unmounted
    return () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '20px', height: 'calc(100vh - 40px)', boxSizing: 'border-box' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: 59.95, lng: 30.33 }}
          zoom={14}
        >
          {userLocation && (
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              label="Your Location"
            />
          )}
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={{ lat: hospital.geometry.location.lat, lng: hospital.geometry.location.lng }}
              onClick={() => setSelectedHospital(hospital)}
            />
          ))}

          {selectedHospital && (
            <InfoWindow
              position={{
                lat: selectedHospital.geometry.location.lat,
                lng: selectedHospital.geometry.location.lng,
              }}
              onCloseClick={() => setSelectedHospital(null)}
            >
              <div>
                <h2>{selectedHospital.name}</h2>
                {/* Any additional hospital info here */}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
