"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import DataGridComponent from "./DataGridComponent";
import supabase from "../../utils/supabaseClient";
import { GridRowsProp } from "@mui/x-data-grid";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import SuccessSnackbar from "./SuccessSnackbar";
import { getColumns2 } from "../constants/datagridColumnsName";
import DeleteModalComponent from "./DeleteModalComponent";
import { useThemeContext } from "./ThemeRegistry";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(10);
  const [locationText, setLocationText] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackString, setSnackString] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<{
    [key: string]: mapboxgl.Marker | null;
  }>({});
  const [showDragableMarker, setShowDragableMarker] = useState(false);
  const [isGeolocateActive, setIsGeolocateActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteid, setDeleteid] = useState<number>(0);
  const { mode } = useThemeContext();

  const mapStyles = {
    light: "mapbox://styles/mapbox/streets-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
  };

  // Function to handle marker drag end
  const onMarkerDragEnd = async () => {
    if (markerRef.current) {
      const newLngLat = markerRef.current.getLngLat(); // Get the new coordinates
      setLng(newLngLat.lng); // Update longitude state
      setLat(newLngLat.lat); // Update latitude state
    }
  };

  //Delete Row From Supabase
  const deleteRow = (id: number) => {
    // Delete the row from Supabase

    setDeleteid(id);
    setOpen(true);
  };
  const confirmDelete = async () => {
    const { error } = await supabase
      .from("location")
      .delete()
      .eq("id", deleteid);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteid));
      setOpen(false);
      setSnackString("data deleted successfully");
      setSnackOpen(true);
    }
  };
  //Save data in Supabase
  const saveLocation = async () => {
    if (lat && lng) {
      const address = await getAddressFromCoordinates(lat, lng); // Get address from coordinates
      const { error } = await supabase
        .from("location")
        .insert([{ latitude: lat, longitude: lng, address: address }]);

      if (error) {
        console.error("Error saving location:", error.message);
      } else {
        setSnackOpen(true);
        setSnackString("Location saved successfully");

        // Reset states after saving
        setIsGeolocateActive(false); // Turn off geolocation
        setShowDragableMarker(false);

        if (markerRef.current) {
          markerRef.current.remove(); // Remove the marker from the map
          markerRef.current = null; // Clear the marker reference
        } // Hide the draggable marker
      }
    }
  };
  //get the address every time the lat and lng change

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLoading(false);
            const { latitude, longitude } = position.coords;
            setLat(latitude);
            setLng(longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to default location if geolocation fails
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();

    const fetchData = async () => {
      const { data, error } = await supabase.from("location").select("*");
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setRows(data);

        // console.log(data);
      }
    };
    fetchData();

    const subscription = supabase
      .channel("realtime-location")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "location" },
        (payload) => {
          // console.log("Change received:", payload);

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
    return () => {
      const removeSubscription = async () => {
        await supabase.removeChannel(subscription);
      };
      removeSubscription();
    };
  }, []);
  useEffect(() => {
    const getaddress = async () => {
      const address = await getAddressFromCoordinates(lat, lng);
      setLocationText(address);
    };
    getaddress();
  }, [lat, lng]);

  //Mapbox integration // Depend on `loading` to ensure the map initializes only when data is ready
  useEffect(() => {
    if (loading || !mapContainerRef.current) return; // Ensure map initializes only after loading is false

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyles[mode],
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

    // Move the map to the user's location once geolocation is available
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

      setLng(longitude);
      setLat(latitude);
      setIsGeolocateActive(true);
    });

    geolocateControl.on("trackuserlocationend", () => {
      setIsGeolocateActive(false);
    });

    // Automatically ask for user location on page load
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Center map to the current location
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });
        }
        setLng(longitude);
        setLat(latitude);
      },
      (error) => {
        console.error("Error getting user location:", error);
        // Default to a known location if geolocation fails
        setLng(73.1);
        setLat(33.7);
      }
    );

    return () => {
      if (mapRef.current) {
        console.log("Cleaning up map instance");
        mapRef.current.remove();
      }
    };
  }, [loading]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyles[mode]);
    }
  }, [mode]);

  //get the address using openstreetmap api form lat and lng
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

  //snackbar close function
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const addMarker = (id: number, lng: number, lat: number) => {
    if (!mapRef.current) return; // Ensure map is initialized

    // Check if marker already exists for this row
    if (markers[id]) {
      markers[id]?.remove(); // Remove marker from map
      setMarkers((prev) => {
        const newMarkers = { ...prev };
        delete newMarkers[id];
        return newMarkers;
      });
    } else {
      // Create a new marker
      const newMarker = new mapboxgl.Marker({ color: "#b40219" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Store marker reference by row ID
      setMarkers((prev) => ({ ...prev, [id]: newMarker }));

      // Update map bounds to ensure all markers are visible
      const bounds = new mapboxgl.LngLatBounds();
      Object.values(markers).forEach((marker) => {
        if (marker) {
          bounds.extend(marker.getLngLat());
        }
      });
      bounds.extend([lng, lat]); // Include the new marker
      mapRef.current.fitBounds(bounds, {
        padding: 50, // Optional padding
        duration: 500,
        maxZoom: 12, // Smooth animation for zoom and center
      });
    }
  };

  const handleShowMarker = (id: number, lat: number, lng: number) => {
    addMarker(id, lng, lat); // ✅ Now passing ID to track each row's marker separately

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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "98vw",
          }}
        >
          {/* Map Container */}
          <Box className="relative w-[50%] h-[540px] m-4">
            <Box
              ref={mapContainerRef}
              className="w-full h-full rounded-xl border-2 border-gray-200 overflow-hidden 
             transform hover:scale-105 transition-transform duration-300 
             shadow-[0px_10px_30px_rgba(0,0,255,0.4)]"
            />
          </Box>

          {/* DataGrid Container */}
          <Box className="w-[50%] my-4 mr-4">
            <DataGridComponent
              rows={rows}
              columns={columns}
              height={"429px"}
              showButton={false}
              locationText={locationText}
              toggleDragableMarker={toggleDraggableMarker}
              isGeolocateActive={isGeolocateActive}
              showDragableMarker={showDragableMarker}
              saveLocation={saveLocation}
            />
          </Box>
        </Box>
      )}
      <DeleteModalComponent
        open={open}
        setOpen={setOpen}
        confirmDelete={confirmDelete}
      />
      <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={snackString}
      />
    </>
  );
};

export default Map;
