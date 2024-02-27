import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Geolocation } from '@capacitor/geolocation';

const mapContainerStyle = {
  height: 'calc(100vh - 120px)',
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
    axios.get(`http://192.168.1.168:8081/api/hospitals?lat=${lat}&lng=${lng}`)
      .then(response => {
        setHospitals(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
      });
  };

  useEffect(() => {
    const getCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      const pos = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
      };
      setUserLocation(pos);
      fetchHospitals(pos);
    };
  
    getCurrentPosition();
  }, []);
  

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '40px 20px 20px', height: 'calc(100vh - 60px)', boxSizing: 'border-box' }}>
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
