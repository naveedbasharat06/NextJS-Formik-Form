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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
  };

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: `${window.location.origin}/auth/callback`,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error("Sign in error:", error);
  };

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome, {session.user?.email}</span>
        <Button variant="outlined" onClick={handleSignOut} className="text-sm">
          Sign Out
        </Button>
      </div>
    );
  }

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
