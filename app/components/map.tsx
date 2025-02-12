"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Import Geocoder CSS
import { Button } from "@mui/material";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
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

    // Initialize the Geocoder
    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search for a location",
      autocomplete: true,
      fuzzyMatch: true,
      limit: 10,
      types: "address,place,poi,postcode,locality,neighborhood,region,district",
    });

    // Add the Geocoder to the map
    if (mapRef.current) {
      mapRef.current.addControl(geocoderRef.current, "top-left");
    }

    // Handle Geocoder result
    geocoderRef.current.on("result", (event) => {
      const [longitude, latitude] = event.result.center;
      console.log("Selected location:", event.result); // Debugging: Log the result
      setLng(longitude);
      setLat(latitude);

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
    });

    // Handle Geocoder errors
    geocoderRef.current.on("error", (error) => {
      console.error("Geocoder error:", error); // Debugging: Log the error
      alert("An error occurred while searching for locations.");
    });

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
    <>
      <div className="w-full h-full flex">
        <div className="relative w-[700px] h-[600px] mt-3">
          <div ref={mapContainerRef} className="w-full h-full" />
          <Button
            onClick={locateUser}
            variant="contained"
            className="absolute top-3 right-4 z-10"
          >
            Locate Me
          </Button>
        </div>
      </div>
    </>
  );
};

export default Map;
