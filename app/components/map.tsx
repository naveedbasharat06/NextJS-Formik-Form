"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Box, Button } from "@mui/material";
import DataGridComponent from "./DataGridComponent";
import supabase from "../../utils/supabaseClient";
import { GridRowsProp } from "@mui/x-data-grid";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import SuccessSnackbar from "./SuccessSnackbar";
import { getColumns2 } from "../data/datagridColumnsName";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [lng, setLng] = useState(73.1);
  const [lat, setLat] = useState(33.7);
  const [zoom, setZoom] = useState(10);
  const [locationText, setLocationText] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackString, setSnackString] = useState("");
  const [markers, setMarkers] = useState<{
    [key: string]: mapboxgl.Marker | null;
  }>({});
  const [showDragableMarker, setShowDragableMarker] = useState(false);
  const [isGeolocateActive, setIsGeolocateActive] = useState(false);

  // Function to handle marker drag end
  const onMarkerDragEnd = async () => {
    if (markerRef.current) {
      const newLngLat = markerRef.current.getLngLat(); // Get the new coordinates
      setLng(newLngLat.lng); // Update longitude state
      setLat(newLngLat.lat); // Update latitude state
    }
  };

  // Columns for the DataGrid
  const deleteRow = async (id: number) => {
    // Delete the row from Supabase
    const { error } = await supabase.from("location").delete().eq("id", id);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setSnackString("data deleted successfully");
      setSnackOpen(true);
    }
  };

  const saveLocation = async () => {
    if (lat && lng) {
      const address = await getAddressFromCoordinates(lat, lng); // ✅ Added await
      const { error } = await supabase
        .from("location")
        .insert([{ latitude: lat, longitude: lng, address: address }]);

      if (error) {
        console.error("Error saving location:", error.message);
      } else {
        setSnackOpen(true);
        setSnackString("Location saved successfully");
      }
    }
  };

  useEffect(() => {
    const getaddress = async () => {
      const address = await getAddressFromCoordinates(lat, lng);
      setLocationText(address);
    };
    getaddress();
  }, [lat, lng]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("location").select("*");
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setRows(data);
        console.log(data);
      }
    };
    fetchData();

    const subscription = supabase
      .channel("realtime-location")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "location" },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            setRows((prev) => [...prev, payload.new]); // Add new row
          } else if (payload.eventType === "DELETE") {
            setRows((prev) => prev.filter((row) => row.id !== payload.old.id)); // Remove deleted row
          } else if (payload.eventType === "UPDATE") {
            setRows((prev) =>
              prev.map((row) => (row.id === payload.new.id ? payload.new : row))
            ); // Update modified row
          }
        }
      )
      .subscribe();

    if (!mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add Geolocate Control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    mapRef.current.addControl(geolocateControl);

    // Move marker when Geolocate Control is activated
    geolocateControl.on("geolocate", (event) => {
      const { longitude, latitude } = event.coords;

      // Move the marker to the user's location
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      // Move the map to the new position
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });
      }

      // Update state
      setLng(longitude);
      setLat(latitude);
      setIsGeolocateActive(true); // ✅ Activate geolocation state
    });

    geolocateControl.on("trackuserlocationend", () => {
      setIsGeolocateActive(false); // ✅ Deactivate geolocation state when off
    });
    // Cleanup on unmount
    return () => {
      const removeSubscription = async () => {
        await supabase.removeChannel(subscription);
      };
      removeSubscription();
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const addMarker = (lng: number, lat: number) => {
    if (!mapRef.current) return; // Ensure map is initialized

    const key = `${lng},${lat}`; // Unique key for each marker

    // Check if marker already exists
    if (markers[key]) {
      markers[key]?.remove(); // Remove marker from map
      setMarkers((prev) => {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      });
    } else {
      // Create a new marker
      const newMarker = new mapboxgl.Marker({ color: "#b40219" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Store marker reference
      setMarkers((prev) => ({ ...prev, [key]: newMarker }));
    }
  };
  const handleShowMarker = (id: number, lat: number, lng: number) => {
    addMarker(lng, lat);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, showEyeIcon: !row.showEyeIcon } : row
      )
    );
  };

  const toggleDraggableMarker = () => {
    setShowDragableMarker((prev) => {
      const newState = !prev;

      if (newState) {
        // Create a new draggable marker if it's not visible
        if (mapRef.current) {
          markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

          markerRef.current.on("dragend", onMarkerDragEnd);
        }
      } else {
        // Remove the marker if disabling
        markerRef.current?.remove();
        markerRef.current = null;
      }

      return newState;
    });
  };

  const columns = getColumns2(handleShowMarker, deleteRow);
  return (
    <>
      {/* Location Input */}

      <Box className="w-full h-full flex">
        {/* Map Container */}
        <Box className="relative w-[50%] h-[525px] m-4">
          <Box
            ref={mapContainerRef}
            className="w-full h-full rounded-xl border-2 border-gray-200 overflow-hidden 
             transform hover:scale-105 transition-transform duration-300 
             shadow-[0px_10px_30px_rgba(0,0,255,0.4)]"
          />
          <Button
            onClick={toggleDraggableMarker}
            variant="contained"
            style={{
              position: "absolute",
              top: "100px",
              right: "16px",
              zIndex: 10,
            }}
          >
            Draggable Marker
          </Button>
          {(showDragableMarker || isGeolocateActive) && (
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
          )}
        </Box>

        {/* DataGrid Container */}
        <Box className="w-[50%] my-4 mr-4">
          <DataGridComponent
            rows={rows}
            columns={columns}
            height={"429px"}
            showButton={false}
            locationText={locationText}
          />
        </Box>
      </Box>
      <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={snackString}
      />
    </>
  );
};

export default Map;
