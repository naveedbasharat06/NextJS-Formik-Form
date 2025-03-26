"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import GoogleOAuthButton from "./GoogleOAuthButton";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";

interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; date?: string };
  end: { dateTime: string; date?: string };
  htmlLink: string;
  status: string;
}

const CustomDay = (
  props: PickersDayProps<Dayjs> & { eventDates?: string[] }
) => {
  const { eventDates = [], day, outsideCurrentMonth, ...other } = props;

  const hasEvents = eventDates.includes(day.format("YYYY-MM-DD"));

  return (
    // <Box sx={{ position: "relative" }}>
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...(hasEvents && {
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#4285F4",
          },
        }),
      }}
    />
    // </Box>
  );
};

const GoogleCalendarPage = () => {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const theme = useTheme();
  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(session);

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
            maxResults: "20",
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

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const getEventDates = () => {
    return events.map((event) =>
      dayjs(event.start.dateTime || event.start.date).format("YYYY-MM-DD")
    );
  };

  const eventsOnSelectedDate = events.filter((event) => {
    const eventDate = dayjs(event.start.dateTime || event.start.date).format(
      "YYYY-MM-DD"
    );
    return eventDate === selectedDate?.format("YYYY-MM-DD");
  });

  return (
    <>
      <Typography
        sx={{
          marginTop: 4,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          // alignItems: "center",
          justifyContent: "center",
          width: "100%",
          p: 4,
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              //   alignItems: "center",
              height: "100vh", // Full viewport height
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <GoogleOAuthButton />
          </Box>
        ) : (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                  //   width: "30%",
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: "8px",
                  boxShadow: 2,
                  margin: 0,
                  "& .Mui-selected": {
                    backgroundColor: "#4285F4 !important",
                  },
                }}
                slots={{
                  day: CustomDay,
                }}
                slotProps={{
                  day: {
                    eventDates: getEventDates(),
                  } as any,
                }}
              />
            </LocalizationProvider>

            <Box sx={{ mt: 4, width: "40%", marginLeft: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Events on {selectedDate?.format("MMMM D, YYYY")}
              </Typography>

              {eventsOnSelectedDate.length === 0 ? (
                <Typography color="textSecondary">No events</Typography>
              ) : (
                eventsOnSelectedDate.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      border: "1px solid lightgray",
                      borderRadius: "8px",
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {event.summary || "No Title"}
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(event.start.dateTime || event.start.date).format(
                        "hh:mm A"
                      )}{" "}
                      -{" "}
                      {dayjs(event.end.dateTime || event.end.date).format(
                        "hh:mm A"
                      )}
                    </Typography>
                    <Chip
                      label={
                        event.status === "confirmed" ? "Confirmed" : "Tentative"
                      }
                      color={
                        event.status === "confirmed" ? "success" : "warning"
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Button
                      href={event.htmlLink}
                      target="_blank"
                      size="small"
                      sx={{ mt: 1, ml: 2 }}
                    >
                      View in Calendar
                    </Button>
                  </motion.div>
                ))
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default GoogleCalendarPage;
