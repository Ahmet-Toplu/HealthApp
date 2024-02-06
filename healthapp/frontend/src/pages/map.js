import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const HospitalMarker = ({ text }) => <div>{text}</div>;

export const MapsPage = () => {
  const [userLocation, setUserLocation] = useState({ lat: 59.95, lng: 30.33 });
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(); // To store the map instance
  const mapsRef = useRef(); // To store the maps API object

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

  useEffect(() => {
    if (mapRef.current && mapsRef.current && hospitals.length > 0) {
      // Now, renderMarkers is called not just when API is loaded but also when hospitals data changes
      renderMarkers(mapRef.current, mapsRef.current);
    }
  }, [hospitals]); // Depend on hospitals

  const fetchHospitals = (location) => {
    const { lat, lng } = location;
    axios.get(`http://localhost:8081/api/hospitals?lat=${lat}&lng=${lng}`)
    .then(response => {
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

    hospitals.forEach((hospital) => {
      console.log("Marker for:", hospital.name); // This should log for each hospital
      new maps.Marker({
        position: { lat: hospital.geometry.location.lat, lng: hospital.geometry.location.lng },
        map: map,
        title: hospital.name,
      });
    });
  };


  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={userLocation}
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          mapRef.current = map;
          mapsRef.current = maps;
          renderMarkers(map, maps); // Initial call in case hospitals are already fetched
        }}

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
