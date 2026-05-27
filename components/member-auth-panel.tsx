"use client";

import { useState } from "react";
import { friendlyAuthErrorMessage, isSupabaseAuthConfigured, isTurnstileConfigured, queueAuthToast, sendEmailSignInLink, startOAuth, verifyEmailOtpCode } from "@/lib/supabase/browser";
import { TurnstileCheck } from "@/components/turnstile-check";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.43.21 2.48.11 2.74.64.72 1.03 1.64 1.03 2.76 0 3.92-2.35 4.78-4.59 5.03.36.32.68.94.68 1.89 0 1.36-.01 2.45-.01 2.78 0 .27.18.6.69.49A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M21.8 12.23c0-.73-.07-1.43-.19-2.1H12v3.98h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.82 3.04-4.5 3.04-7.52Z"/>
      <path fill="#34A853" d="M12 22c2.75 0 5.06-.93 6.74-2.52l-3.3-2.56c-.92.63-2.1 1.01-3.44 1.01-2.64 0-4.88-1.83-5.68-4.28H2.91v2.64A10 10 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.32 13.65A6.05 6.05 0 0 1 6 11.99c0-.58.11-1.13.32-1.66V7.69H2.91A10.12 10.12 0 0 0 2 11.99c0 1.53.36 2.97.91 4.3l3.41-2.64Z"/>
      <path fill="#EA4335" d="M12 6.07c1.49 0 2.83.53 3.88 1.56l2.9-2.98C17.05 2.98 14.74 2 12 2A10 10 0 0 0 2.91 7.69l3.41 2.64C7.12 7.9 9.36 6.07 12 6.07Z"/>
    </svg>
  );
}

function MailMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M3.75 6.75h16.5v10.5H3.75z" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2.7]">
      <path d="M5 12.4 9.2 16 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MemberAuthPanel({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [captchaToken, setCaptchaToken] = useState("");
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseAuthConfigured();
  const turnstileEnabled = isTurnstileConfigured();
  const waitingForHumanVerification = turnstileEnabled && !captchaToken;

  async function signInWithProvider(provider: "github" | "google") {
    setMessage("");
    setMessageType("info");

    if (!configured) {
      setMessageType("error");
      setMessage("Authentication is not ready yet. Add the application system URL and publishable key first.");
      return;
    }

    setBusy(true);
    startOAuth(provider);
  }

  async function signInWithEmail() {
    setMessage("");
    setMessageType("info");

    if (!configured) {
      setMessageType("error");
      setMessage("Authentication is not ready yet. Add the application system URL and publishable key first.");
      return;
    }

    if (!email.trim()) {
      setMessageType("error");
      setMessage("Enter an email address.");
      return;
    }

    if (turnstileEnabled && !captchaToken) {
      setMessageType("error");
      setMessage("Complete human verification before requesting an email code.");
      return;
    }

    setBusy(true);
    try {
      await sendEmailSignInLink(email.trim(), captchaToken || undefined);
      setCodeSent(true);
      setMessageType("success");
      setMessage("Verification code sent. Enter the code from your email to continue.");
    } catch (error) {
      setMessageType("error");
      setMessage(friendlyAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmailCode() {
    setMessage("");
    setMessageType("info");

    if (!configured) {
      setMessageType("error");
      setMessage("Authentication is not ready yet. Add the application system URL and publishable key first.");
      return;
    }

    if (!email.trim()) {
      setMessageType("error");
      setMessage("Enter your email address first.");
      return;
    }

    const cleanCode = otpCode.replace(/\D/g, "");
    if (cleanCode.length < 6) {
      setMessageType("error");
      setMessage("Enter the verification code from your email.");
      return;
    }

    setBusy(true);
    try {
      await verifyEmailOtpCode(email.trim(), cleanCode);
      setMessageType("success");
      setMessage("Signed in. Opening home page.");
      queueAuthToast("Signed in", "success");
      window.location.href = "/";
    } catch (error) {
      setMessageType("error");
      setMessage(friendlyAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (waitingForHumanVerification) {
    return (
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Human verification
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-neutral-950">Verify first.</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-neutral-600">
            Complete the check before GitHub, Google, or email sign in opens.
          </p>
          <div className="mt-5">
            <TurnstileCheck onTokenChange={setCaptchaToken} />
          </div>
        </div>
        <p className="text-sm leading-7 text-neutral-500">
          The sign in options appear automatically  after  verification succeeds.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {turnstileEnabled ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"><CheckMark /></span>
          <span>Human verification complete.</span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => signInWithProvider("github")}
        disabled={busy}
        className="flex min-h-[4rem] w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-5 text-base font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GitHubMark />
        <span>{mode === "signup" ? "Continue with GitHub" : "Sign in with GitHub"}</span>
      </button>

      <button
        type="button"
        onClick={() => signInWithProvider("google")}
        disabled={busy}
        className="flex min-h-[4rem] w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-5 text-base font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleMark />
        <span>{mode === "signup" ? "Continue with Google" : "Sign in with Google"}</span>
      </button>

      <div className="pt-2">
        <label className="block">
          <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Email</span>
          <div className="mt-3 flex min-h-[4rem] items-center gap-3 border border-neutral-300 bg-white px-4 focus-within:border-neutral-950">
            <span className="text-neutral-500"><MailMark /></span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  signInWithEmail();
                }
              }}
              type="email"
              placeholder="member@example.com"
              className="h-full w-full border-0 bg-transparent text-base text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={signInWithEmail}
        disabled={busy}
        className="flex min-h-[4rem] w-full items-center justify-center gap-3 bg-[#1857ff] px-6 text-base font-semibold text-white transition hover:bg-[#0f49e0] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MailMark />
        <span>{mode === "signup" ? "Send verification code" : "Send verification code"}</span>
      </button>

      {codeSent ? (
        <div className="border border-neutral-200 bg-neutral-50 p-4">
          <label className="block">
            <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Verification code</span>
            <input
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  verifyEmailCode();
                }
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 8 digit code"
              className="mt-3 h-14 w-full border border-neutral-300 bg-white px-4 text-center text-xl font-semibold tracking-[0.35em] text-neutral-950 outline-none placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </label>
          <button
            type="button"
            onClick={verifyEmailCode}
            disabled={busy}
            className="mt-3 flex min-h-[3.5rem] w-full items-center justify-center bg-neutral-950 px-6 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verify code and sign in
          </button>
          <button
            type="button"
            onClick={signInWithEmail}
            disabled={busy}
            className="mt-3 text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send a new code
          </button>
        </div>
      ) : null}

      {message ? (
        <p
          className={`pt-2 text-sm leading-7 ${
            messageType === "error"
              ? "text-red-600"
              : messageType === "success"
                ? "text-emerald-700"
                : "text-neutral-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
