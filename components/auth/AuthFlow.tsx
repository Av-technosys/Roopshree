"use client";

import { useState } from "react";
import {
  ForgotOtpScreen,
  SetNewPasswordScreen,
  SignupOtpScreen,
} from "@/components/auth/AuthResetScreens";
import Forgotpass from "@/components/auth/Forgotpass";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";

type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "forgot-otp"
  | "set-new-password"
  | "signup-otp";

export default function AuthFlow() {
  const [view, setView] = useState<AuthView>("login");

  if (view === "signup") {
    return (
      <Signup
        onLogin={() => setView("login")}
        onVerifyOtp={() => setView("signup-otp")}
      />
    );
  }

  if (view === "signup-otp") {
    return (
      <SignupOtpScreen
        onBackToLogin={() => setView("login")}
        onVerifyOtp={() => setView("login")}
      />
    );
  }

  if (view === "forgot-password") {
    return (
      <Forgotpass
        onBackToLogin={() => setView("login")}
        onCreateAccount={() => setView("signup")}
        onSendOtp={() => setView("forgot-otp")}
      />
    );
  }

  if (view === "forgot-otp") {
    return (
      <ForgotOtpScreen
        onBackToLogin={() => setView("login")}
        onVerifyOtp={() => setView("set-new-password")}
      />
    );
  }

  if (view === "set-new-password") {
    return <SetNewPasswordScreen onBackToLogin={() => setView("login")} />;
  }

  return (
    <Login
      onCreateAccount={() => setView("signup")}
      onForgotPassword={() => setView("forgot-password")}
    />
  );
}
