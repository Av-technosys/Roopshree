"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

export function ForgotOtpScreen({
  onBackToLogin,
  onVerifyOtp,
}: {
  onBackToLogin?: () => void;
  onVerifyOtp?: () => void;
}) {
  return (
    <OtpScreen
      title="Forgot Password"
      subtitle="Verify OTP to Reset Password"
      buttonText="Verify OTP"
      onBackToLogin={onBackToLogin}
      onVerifyOtp={onVerifyOtp}
    />
  );
}

export function SignupOtpScreen({
  onBackToLogin,
  onVerifyOtp,
}: {
  onBackToLogin?: () => void;
  onVerifyOtp?: () => void;
}) {
  return (
    <OtpScreen
      title="OTP Verification"
      subtitle="Verify OTP to Sign up"
      buttonText="Verify OTP"
      onBackToLogin={onBackToLogin}
      onVerifyOtp={onVerifyOtp}
    />
  );
}

export function SetNewPasswordScreen({
  onBackToLogin,
}: {
  onBackToLogin?: () => void;
}) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <PlainAuthShell onBackToLogin={onBackToLogin}>
      <div className="mb-7">
        <h1 className="font-playfairDisplay text-[32px] font-semibold leading-tight text-[#3b2418] sm:text-[36px]">
          Set New Password
        </h1>
        <p className="mt-2 text-xs text-[#c9914d] sm:text-sm">
          Enter your registered email to recieve reset link
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onBackToLogin?.();
        }}
      >
        <PasswordInput
          placeholder="New Password"
          type={showNewPassword ? "text" : "password"}
          icon={showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          label={showNewPassword ? "Hide new password" : "Show new password"}
          onToggle={() => setShowNewPassword((current) => !current)}
        />

        <PasswordInput
          placeholder="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          icon={showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          label={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
          onToggle={() => setShowConfirmPassword((current) => !current)}
        />

        <button
          type="submit"
          className="h-11 w-full rounded-[4px] bg-[#c9914d] text-xs font-semibold tracking-[2px] text-white transition hover:bg-[#b57f3f]"
        >
          Update Password
        </button>
      </form>
    </PlainAuthShell>
  );
}

function OtpScreen({
  title,
  subtitle,
  buttonText,
  onBackToLogin,
  onVerifyOtp,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  onBackToLogin?: () => void;
  onVerifyOtp?: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  return (
    <PlainAuthShell onBackToLogin={onBackToLogin}>
      <div className="mb-6">
        <h1 className="font-playfairDisplay text-[32px] font-semibold leading-tight text-[#3b2418] sm:text-[36px]">
          {title}
        </h1>
        <p className="mt-2 text-xs text-[#c9914d] sm:text-sm">{subtitle}</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onVerifyOtp?.();
        }}
      >
        <div className="grid grid-cols-6 gap-3 sm:gap-[26px]">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              value={digit}
              maxLength={1}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !otp[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className="h-11 w-full rounded-[4px] border border-[#3b2418]/70 bg-white text-center text-base text-[#3b2418] outline-none focus:border-[#c9914d]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-[4px] bg-[#c9914d] text-xs font-semibold tracking-[2px] text-white transition hover:bg-[#b57f3f]"
        >
          {buttonText}
        </button>
      </form>
    </PlainAuthShell>
  );
}

function PasswordInput({
  placeholder,
  type,
  icon,
  label,
  onToggle,
}: {
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  label: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-11 items-center rounded-[4px] border border-[#c9914d] px-4">
      <span className="mr-5 text-[#3b2418]">
        <Lock size={15} />
      </span>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#3b2418] outline-none placeholder:text-[#8a8580]"
      />

      <button
        type="button"
        aria-label={label}
        onClick={onToggle}
        className="ml-3 rounded-[4px] text-[#3b2418]/60"
      >
        {icon}
      </button>
    </div>
  );
}

function PlainAuthShell({
  children,
  onBackToLogin,
}: {
  children: React.ReactNode;
  onBackToLogin?: () => void;
}) {
  return (
    <div className="min-h-screen w-full bg-white px-5 py-8 sm:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[405px] flex-col justify-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="mb-7 flex w-fit items-center gap-2 rounded-[4px] text-sm font-medium text-[#3b2418] transition hover:text-[#c9914d]"
        >
          <ArrowLeft size={17} />
          Back to Login
        </button>

        {children}
      </main>
    </div>
  );
}
