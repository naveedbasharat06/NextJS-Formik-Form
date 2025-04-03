"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState, use } from "react";
import supabase from "../../../utils/supabaseClient";
import DOMPurify from "dompurify";

export default function EmailDetailPage({
  params,
}: {
  params: Promise<{ emailId: string }>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailBody, setEmailBody] = useState<string>("");

  const { emailId } = use(params);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.provider_token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${session.provider_token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch email");

        const emailData = await response.json();
        setEmail(emailData);
        setEmailBody(extractEmailBody(emailData));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [emailId]);

  const extractEmailBody = (emailData: any): string => {
    if (!emailData.payload) return "No content available";

    if (emailData.payload.parts) {
      const htmlPart = emailData.payload.parts.find(
        (part: any) => part.mimeType === "text/html"
      );
      const textPart = emailData.payload.parts.find(
        (part: any) => part.mimeType === "text/plain"
      );

      if (htmlPart?.body?.data) {
        return decodeBase64(htmlPart.body.data);
      } else if (textPart?.body?.data) {
        return decodeBase64(textPart.body.data);
      }
    } else if (emailData.payload.body?.data) {
      return decodeBase64(emailData.payload.body.data);
    }

    return "No readable content found";
  };

  const decodeBase64 = (str: string): string => {
    try {
      return decodeURIComponent(
        atob(str.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (e) {
      console.error("Error decoding base64:", e);
      return "Error displaying content";
    }
  };

  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "b",
        "i",
        "em",
        "strong",
        "a",
        "br",
        "div",
        "span",
        "ul",
        "ol",
        "li",
        "img",
      ],
      ALLOWED_ATTR: ["href", "target", "style", "src", "alt"],
    });
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );

  const getHeader = (name: string) =>
    email?.payload?.headers?.find(
      (h: any) => h.name.toLowerCase() === name.toLowerCase()
    )?.value || "";

  return (
    <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
        variant="contained"
        color="primary"
      >
        Back to Inbox
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            {getHeader("Subject")}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>
            <strong>From:</strong> {getHeader("From")}
          </Typography>
          <Typography>
            <strong>To:</strong> {getHeader("To")}
          </Typography>
          <Typography>
            <strong>Date:</strong>{" "}
            {new Date(parseInt(email?.internalDate || "")).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "background.paper",
              overflowWrap: "break-word",
              padding: 2,
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(emailBody) }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
