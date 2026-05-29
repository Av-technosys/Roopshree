"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") === "signup" ? "signup" : "login";
  const [view, setView] = useState<AuthView>(initialView);
  const [signupCredentials, setSignupCredentials] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordState, setForgotPasswordState] = useState({
    email: "",
    code: "",
  });

  if (view === "signup") {
    return (
      <Signup
        onLogin={() => setView("login")}
        onVerifyOtp={(credentials) => {
          setSignupCredentials(credentials);
          setView("signup-otp");
        }}
      />
    );
  }

  if (view === "signup-otp") {
    return (
      <SignupOtpScreen
        email={signupCredentials.email}
        password={signupCredentials.password}
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
        onSendOtp={(email) => {
          setForgotPasswordState((current) => ({ ...current, email }));
          setView("forgot-otp");
        }}
      />
    );
  }

  if (view === "forgot-otp") {
    return (
      <ForgotOtpScreen
        email={forgotPasswordState.email}
        onBackToLogin={() => setView("login")}
        onVerifyOtp={(code) => {
          setForgotPasswordState((current) => ({ ...current, code }));
          setView("set-new-password");
        }}
      />
    );
  }

  if (view === "set-new-password") {
    return (
      <SetNewPasswordScreen
        email={forgotPasswordState.email}
        code={forgotPasswordState.code}
        onBackToLogin={() => setView("login")}
      />
    );
  }

  return (
    <Login
      onCreateAccount={() => setView("signup")}
      onForgotPassword={() => setView("forgot-password")}
    />
  );
}
