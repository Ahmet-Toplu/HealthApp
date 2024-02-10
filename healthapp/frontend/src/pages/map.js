import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const HospitalMarker = ({ text }) => <div style={{ color: 'red' }}>{text}</div>;
const UserLocationMarker = ({ text }) => <div style={{ color: 'blue' }}>{text}</div>;

export const MapsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(null);
  const userLocationMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);

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

          if (mapRef.current) {
            // Update the marker and circle's position on the map
            if (userLocationMarkerRef.current) {
              userLocationMarkerRef.current.setPosition(pos);
              accuracyCircleRef.current.setCenter(pos);
              accuracyCircleRef.current.setRadius(position.coords.accuracy);
            } else {
              // Initialize the marker and circle if they don't exist yet
              userLocationMarkerRef.current = new window.google.maps.Marker({
                position: pos,
                map: mapRef.current,
                title: 'Your Location',
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#0000FF",
                  fillOpacity: 0.4,
                  strokeWeight: 0.4
                }
              });

              accuracyCircleRef.current = new window.google.maps.Circle({
                strokeColor: "#0000FF",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.1,
                map: mapRef.current,
                center: pos,
                radius: position.coords.accuracy,
              });
            }
          }
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

  useEffect(() => {
    if (mapRef.current) {
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
    <div className='mx-3 mt-3'>
      <div style={{ paddingBottom: '88px', height: '100vh', width: '100%' }}>
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
    </div>
  );
};
