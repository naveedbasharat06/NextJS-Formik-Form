"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Button, TextField } from "@mui/material";
import DataGridComponent from "./DataGridComponent";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [lng, setLng] = useState(73.1);
  const [lat, setLat] = useState(33.7);
  const [zoom, setZoom] = useState(10);
  const [locationText, setLocationText] = useState("");
  const [savedLocations, setSavedLocations] = useState<
    { id: number; lat: number; lng: number; address: string }[]
  >([]);

  // Columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "lat", headerName: "Latitude", width: 150 },
    { field: "lng", headerName: "Longitude", width: 150 },
    { field: "address", headerName: "Address", width: 400 },
  ];

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

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        return data.display_name; // Full address
      }
      return `Latitude: ${lat}, Longitude: ${lng}`; // Fallback if no address is found
    } catch (error) {
      console.error("Error fetching address:", error);
      return `Latitude: ${lat}, Longitude: ${lng}`; // Fallback on error
    }
  };

  const locateUser = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        setLat(latitude);
        setLng(longitude);

        // Get the full address using Nominatim API
        const address = await getAddressFromCoordinates(latitude, longitude);
        setLocationText(address);

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

  const saveLocation = async () => {
    if (lat && lng) {
      const address = await getAddressFromCoordinates(lat, lng);
      const newLocation = {
        id: savedLocations.length + 1, // Generate a unique ID
        lat,
        lng,
        address,
      };
      setSavedLocations([...savedLocations, newLocation]);
    }
  };

  return (
    <>
      <div className="w-full h-full flex mt-4 m-4">
        {/* Map Container */}
        <div className="relative w-[50%] h-[578px] m-2">
          <div
            ref={mapContainerRef}
            className="w-full h-full rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300"
          />
          <Button
            onClick={locateUser}
            variant="contained"
            style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              zIndex: 10,
            }}
          >
            Locate Me
          </Button>
          <Button
            onClick={saveLocation}
            variant="contained"
            style={{
              position: "absolute",
              top: "60px",
              right: "16px",
              zIndex: 10,
            }}
          >
            Save Location
          </Button>
        </div>

        {/* DataGrid Container */}
        <div className="w-[50%] h-[500px] mt-2">
          <DataGridComponent rows={savedLocations} columns={columns} height={"80vh"} />
        </div>
      </div>
    </>
  );
};

export default Map;