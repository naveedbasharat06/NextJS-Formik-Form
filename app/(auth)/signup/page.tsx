"use client";
import React from "react";
import SignupForm from "../../components/SignupForm";

const SignupPage: React.FC = () => {
  const handleSuccess = () => {
    console.log("Signup successful!");
  };

  const handleError = (error: string) => {
    console.error("Signup error:", error);
  };

  return (
    <div>
      <SignupForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default SignupPage;