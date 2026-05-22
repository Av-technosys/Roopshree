"use client";

import { ArrowLeft, Mail } from "lucide-react";

export default function Forgotpass({
  onBackToLogin,
  onCreateAccount,
  onSendOtp,
}: {
  onBackToLogin?: () => void;
  onCreateAccount?: () => void;
  onSendOtp?: () => void;
}) {
  return (
    <div className="min-h-screen w-full bg-white px-5 py-8 sm:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[580px] flex-col justify-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="mb-9 flex w-fit items-center gap-2 text-sm font-medium text-[#3b2418] transition hover:text-[#c9914d] sm:text-base"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="mb-8">
          <h1 className="font-playfairDisplay text-[34px] font-semibold leading-tight text-[#3b2418] sm:text-[42px]">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-[#c9914d] sm:text-base">
            Enter your registered email to recieve reset link
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            onSendOtp?.();
          }}
        >
          <div className="flex h-14 items-center border border-[#c9914d] px-5 sm:h-16">
            <span className="mr-5 text-[#3b2418]">
              <Mail size={18} />
            </span>

            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent text-sm text-[#3b2418] outline-none placeholder:text-[#8a8580] sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="h-14 w-full bg-[#c9914d] text-sm font-semibold tracking-[2px] text-white transition hover:bg-[#b57f3f] sm:h-[58px] sm:text-base"
          >
            Send OTP
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#c9914d] sm:text-base">
          Don&apos;t Have An Account?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            className="font-semibold text-[#3b2418] underline"
          >
            Create Account
          </button>
        </p>
      </main>
    </div>
  );
}
