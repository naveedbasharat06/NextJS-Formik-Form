"use client";
import { Button, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import supabase from "../utils/supabaseClient";
import { useTheme } from "@mui/material";

// interface GoogleOAuthButtonProps {
//   variant?: "signin" | "signup";
// }

function GoogleOAuthButton() {
  const theme = useTheme();
  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        scopes: [
          "https://www.googleapis.com/auth/calendar.events.readonly",
          "https://www.googleapis.com/auth/calendar.readonly",
        ].join(" "),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google OAuth error:", error);
      alert(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<FcGoogle />}
      onClick={handleSignInWithGoogle}
      sx={{
        background: theme.palette.secondary.main,
      }}
      className="w-full flex items-center justify-center gap-2"
    >
      <Typography>SIGN IN WITH GOOGLE</Typography>
    </Button>
  );
}

export default GoogleOAuthButton;
