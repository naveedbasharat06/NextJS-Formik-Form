"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import MailIcon from "@mui/icons-material/Mail";
import RefreshIcon from "@mui/icons-material/Refresh";
import GoogleOAuthButton from "./GoogleOAuthButton";
import { formatDistanceToNow } from "date-fns";
import DataGridComponent from "./DataGridComponent";
import { gmailColumns } from "../constants/datagridColumnsName";

interface Email {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    parts?: Array<{
      mimeType: string;
      body: {
        data?: string;
      };
    }>;
  };
  internalDate: string;
}

interface EmailHeader {
  from: string;
  to: string;
  subject: string;
  date: string;
}

const GmailInbox = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useState<EmailHeader | null>(null);

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
          await fetchEmails(session.provider_token);
        } else {
          setError("Please sign in with Google to access your emails");
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
        await fetchEmails(session.provider_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEmails = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?` +
          new URLSearchParams({
            maxResults: "100", // Reduced for debugging
            q: "in:inbox",
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
        if (errorData.error?.code === 429) {
          throw new Error("Gmail API quota exceeded. Try again later.");
        }
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        const emailDetails = await Promise.all(
          data.messages.map(async (message: { id: string }) => {
            const emailResponse = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
                },
              }
            );
            return emailResponse.json();
          })
        );
        setEmails(emailDetails.filter((email) => email?.id)); // Filter out invalid emails
      } else {
        setEmails([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch emails");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const getEmailHeaders = (email: Email): EmailHeader => {
    const headers = email.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h?.name === name)?.value || "";

    return {
      from: getHeader("From"),
      to: getHeader("To"),
      subject: getHeader("Subject") || "No Subject",
      date: getHeader("Date"),
    };
  };

  const handleRefresh = async () => {
    if (session?.provider_token) {
      await fetchEmails(session.provider_token);
    }
  };

  const formatEmailDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString));
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  // Prepare rows with fallback IDs and validation
  const rows = emails
    .filter((email) => email?.id && email?.payload) // Filter invalid emails
    .map((email) => {
      const headers = getEmailHeaders(email);
      return {
        id: email.id, // Guaranteed to exist due to filter
        from: headers.from,
        subject: headers.subject,
        snippet: email.snippet,
        date: headers.date,
        formattedDate: formatEmailDate(email.internalDate),

        emailData: email,
      };
    });
  const columns = gmailColumns;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5, // Full viewport height
        width: "100%",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          {error.includes("quota") && (
            <Button
              variant="contained"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )}
          {!session && <GoogleOAuthButton />}
        </Box>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          // style={{ width: "100%", height: "70vh", maxWidth: "1200px" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              width: "77vw",
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <MailIcon sx={{ mr: 1 }} /> Inbox
            </Typography>

            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          <DataGridComponent
            rows={rows}
            columns={columns}
            showUserButton={true}
            width={"77vw"}
          />
        </motion.div>
      )}
    </Box>
  );
};

export default GmailInbox;
