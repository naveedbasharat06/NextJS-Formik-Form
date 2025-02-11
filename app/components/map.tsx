"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState(73.0479);
  const [lat, setLat] = useState(33.6844);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add a marker at the default location
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        setLat(latitude);
        setLng(longitude);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });

          if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
          } else {
            markerRef.current = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current);
          }
        }
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="relative w-screen h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
      <button
        onClick={locateUser}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Locate Me
      </button>
    </div>
  );
};

export default Map;
