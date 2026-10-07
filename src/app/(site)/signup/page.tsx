"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, isAdminEmail } from "@/lib/firebase";
import { Loader2, Lock, Mail, UserRound } from "lucide-react";
import AuthCard from "@/components/AuthCard";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("The password must contain at least 8 characters.");
      setStatus("error");
      return;
    }
    if (form.password !== form.confirm) {
      setError("The passwords do not match.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      await updateProfile(cred.user, { displayName: form.name });
      router.push(isAdminEmail(cred.user.email) ? "/admin" : "/");
      router.refresh();
    } catch (err: any) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "An account already exists with this email address."
          : "Sign-up failed. Please check your information.",
      );
      setStatus("error");
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Ooredoo and manage your plans online."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ooredoo-red hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Full name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              className="input-field !pl-10"
              placeholder="Your name"
              value={form.name}
              onChange={set("name")}
            />
          </div>
        </div>
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
              value={form.email}
              onChange={set("email")}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              minLength={8}
              className="input-field !pl-10"
              placeholder="8 characters min."
              value={form.password}
              onChange={set("password")}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              className="input-field !pl-10"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set("confirm")}
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
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
