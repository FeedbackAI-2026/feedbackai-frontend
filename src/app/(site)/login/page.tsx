"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isAdminEmail } from "@/lib/firebase";
import { Loader2, Lock, Mail } from "lucide-react";
import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Admin → dashboard, client → home
      router.push(isAdminEmail(cred.user.email) ? "/admin" : "/");
      router.refresh();
    } catch (err: any) {
      setError("Incorrect credentials or account does not exist.");
      setStatus("error");
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Ooredoo customer account."
      footer={
        <>
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-ooredoo-red hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
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
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-ooredoo-red hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              className="input-field !pl-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
