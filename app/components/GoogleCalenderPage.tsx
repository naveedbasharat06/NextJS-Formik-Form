"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GoogleOAuthButton from "./GoogleOAuthButton";

interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; date?: string };
  end: { dateTime: string; date?: string };
  htmlLink: string;
  status: string;
}

const GoogleCalendarPage = () => {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. Get session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(session);

        // 2. If we have a token, fetch events
        if (session?.provider_token) {
          await fetchCalendarEvents(session.provider_token);
        } else {
          setError("Please sign in with Google to access your calendar");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Initialization failed");
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.provider_token) {
        setSession(session);
        await fetchCalendarEvents(session.provider_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCalendarEvents = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
          new URLSearchParams({
            maxResults: "10",
            orderBy: "startTime",
            singleEvents: "true",
            timeMin: new Date().toISOString(),
          }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setEvents(data.items || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendar events"
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = async () => {
    if (session?.provider_token) {
      await fetchCalendarEvents(session.provider_token);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Typography
        sx={{
          fontSize: "2.5rem", // Larger font size for better visibility
          fontWeight: "bold", // Bold text
          color: (theme) => theme.palette.primary.main, // Use theme's primary color
          textAlign: "center", // Center align the text
          textTransform: "uppercase", // Uppercase text
          letterSpacing: "0.15em", // Increased letter spacing for emphasis
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)", // Add a shadow effect for depth
          transition: "color 0.3s, transform 0.3s", // Smooth transitions
          "&:hover": {
            color: (theme) => theme.palette.secondary.main, // Use theme's secondary color on hover
            transform: "scale(1.05)", // Slight scaling effect on hover
          },
        }}
      >
        EVENTS
      </Typography>

      {loading ? (
        <CircularProgress size={60} />
      ) : error ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <GoogleOAuthButton />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: "center" }}>
          <EventIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Upcoming Events
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<AccessTimeIcon />}
          >
            Refresh Events
          </Button>
        </Box>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5">Upcoming Events</Typography>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<AccessTimeIcon />}
            >
              Refresh
            </Button>
          </Box>

          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {events.map((event) => (
              <ListItem key={event.id} divider sx={{ py: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">
                      {event.summary || "No Title"}
                    </Typography>
                    <Chip
                      label={
                        event.status === "confirmed" ? "Confirmed" : "Tentative"
                      }
                      color={
                        event.status === "confirmed" ? "success" : "warning"
                      }
                    />
                  </Box>
                  {event.description && (
                    <Typography variant="body2" sx={{ my: 1 }}>
                      {event.description}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography>
                      {formatDateTime(event.start.dateTime || event.start.date)}{" "}
                      - {formatDateTime(event.end.dateTime || event.end.date)}
                    </Typography>
                  </Box>
                  <Button
                    href={event.htmlLink}
                    target="_blank"
                    size="small"
                    sx={{ mt: 1 }}
                    startIcon={<CalendarTodayIcon />}
                  >
                    Open in Calendar
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </motion.div>
      )}
    </Box>
  );
};

export default GoogleCalendarPage;
