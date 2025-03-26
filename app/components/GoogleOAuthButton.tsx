"use client";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import supabase from "../utils/supabaseClient";

interface GoogleOAuthButtonProps {
  variant?: "signin" | "signup";
}

function GoogleOAuthButton({ variant = "signin" }: GoogleOAuthButtonProps) {
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
      variant="outlined"
      startIcon={<FcGoogle />}
      onClick={handleSignInWithGoogle}
      className="w-full flex items-center justify-center gap-2"
    >
      {variant === "signin" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
}

export default GoogleOAuthButton;
