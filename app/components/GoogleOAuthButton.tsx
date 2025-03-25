"use client";

import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  variant?: "signin" | "signup";
}

function GoogleOAuthButton({ variant = "signin" }: GoogleOAuthButtonProps) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: `${window.location.origin}/auth/callback`,
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) console.error("Sign in error:", error);
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
