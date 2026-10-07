"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Mail } from "lucide-react";
import AuthCard from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      // Firebase automatically sends the password reset email.
      await sendPasswordResetEmail(auth, email);
      setStatus("done");
    } catch {
      setError(
        "Unable to send the email. Please check the address you entered.",
      );
      setStatus("error");
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email to receive a password reset link."
      footer={
        <Link
          href="/login"
          className="font-semibold text-ooredoo-red hover:underline"
        >
          ← Back to login
        </Link>
      }
    >
      {status === "done" ? (
        <div className="space-y-4 text-center">
          <span className="mx-auto flex w-fit rounded-full bg-green-50 p-3 text-green-500">
            <Mail className="h-6 w-6" />
          </span>
          <p className="text-sm text-slate-600">
            If an account is associated with <strong>{email}</strong>, a
            password reset email has been sent. Please check your spam folder.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                className="input-field !pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {status === "error" && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-ooredoo-red">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
