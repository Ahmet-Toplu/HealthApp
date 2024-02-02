import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

export const MapsPage = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 59.95, // Default latitude
    lng: 30.33, // Default longitude
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: userLocation,
      map,
      title: 'Your Location',
    });
  };

  return (
    <div className="page-container">
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          center={userLocation} // Use center instead of defaultCenter
          defaultZoom={10}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
        />
      </div>
      <div className="content">
        {/* Your page content goes here */}
      </div>
    </div>
  );
};
