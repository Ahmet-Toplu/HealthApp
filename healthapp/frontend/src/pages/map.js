import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const HospitalMarker = ({ text }) => <div>{text}</div>;

export const MapsPage = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 59.95,
    lng: 30.33,
  });
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(pos);

        // Fetch nearby hospitals
        fetchHospitals(pos);
      });
    }
  }, []);

  const fetchHospitals = (location) => {
    const { lat, lng } = location;
    axios.get(`http://localhost:8081/api/hospitals?lat=${lat}&lng=${lng}`)
    .then(response => {
        console.log(response.data.results);
        setHospitals(response.data.results);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: userLocation,
      map,
      title: 'Your Location',
    });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={userLocation}
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      >
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
