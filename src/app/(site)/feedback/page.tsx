"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { submitFeedback } from "@/lib/feedback";
import {
  CheckCircle2,
  Clock3,
  Headset,
  Inbox,
  Loader2,
  Send,
  Sparkles,
  Star,
} from "lucide-react";

const categories = [
  "Complaint",
  "Technical issue",
  "Billing",
  "Suggestion",
  "Praise",
  "Other",
];

export default function FeedbackPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Complaint",
    subject: "",
    message: "",
    rating: 5,
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [docId, setDocId] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email) setForm((f) => ({ ...f, email: f.email || u.email! }));
      if (u?.displayName)
        setForm((f) => ({ ...f, name: f.name || u.displayName! }));
    });
  }, []);

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      // Directly save to Firebase (Firestore).
      // The backend (AI) team listens for new documents, generates
      // `aiResponse` on this document and sends it by email via Gmail API.
      const id = await submitFeedback(form);
      setDocId(id);
      setStatus("success");
    } catch (err: any) {
      setError("Failed to send. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="card flex w-full flex-col items-center py-14">
          <span className="rounded-full bg-green-50 p-4 text-green-500">
            <CheckCircle2 className="h-12 w-12" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold">
            Thank you for your feedback!
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-500">
            Your message has been saved and forwarded to our support system. An
            AI-generated response will be sent to
            <strong> {form.email}</strong> shortly.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-600">
            <Sparkles className="h-3.5 w-3.5" /> AI analysis in progress…
          </div>
          <div className="mt-8 flex gap-3">
            <Link href="/" className="btn-outline">
              Back to home
            </Link>
            <button
              className="btn-primary"
              onClick={() => {
                setForm({
                  name: user?.displayName || "",
                  email: user?.email || "",
                  category: "Complaint",
                  subject: "",
                  message: "",
                  rating: 5,
                });
                setStatus("idle");
              }}
            >
              New message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left panel */}
        <div className="lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-ooredoo-red">
            Feedback &amp; Complaints
          </span>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Your feedback matters.
          </h1>
          <p className="mt-4 leading-relaxed text-slate-500">
            A service issue, a bill, an idea, or a compliment? Write to us: your
            message is saved in our system, analyzed by our artificial
            intelligence, and the response is sent directly to you by email.
          </p>

          <div className="mt-8 space-y-4">
            {[
              {
                icon: Inbox,
                title: "Instant saving",
                desc: "Your message is saved in Firebase as soon as you submit it.",
              },
              {
                icon: Sparkles,
                title: "AI response",
                desc: "Our AI generates a response tailored to your request.",
              },
              {
                icon: Clock3,
                title: "Email response",
                desc: "The response is sent directly to you by email.",
              },
              {
                icon: Headset,
                title: "Human follow-up",
                desc: "Our team supervises every interaction from the dashboard.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft"
              >
                <span className="rounded-xl bg-red-50 p-3 text-ooredoo-red">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{f.title}</p>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card h-fit lg:col-span-3">
          <h2 className="text-xl font-bold">Send a message</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fields marked with a <span className="text-ooredoo-red">*</span> are
            required.
            {user ? (
              <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                Connected — tracked through your account
              </span>
            ) : (
              <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                Not connected — identified by your email
              </span>
            )}
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Full name <span className="text-ooredoo-red">*</span>
              </label>
              <input
                required
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Email address <span className="text-ooredoo-red">*</span>
              </label>
              <input
                required
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Category
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={set("category")}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Overall rating
              </label>
              <div className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} stars`}
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className={
                      n <= form.rating ? "text-amber-400" : "text-slate-300"
                    }
                  >
                    <Star className="h-5 w-5" fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold">
                Subject <span className="text-ooredoo-red">*</span>
              </label>
              <input
                required
                className="input-field"
                placeholder="Summary of your request"
                value={form.subject}
                onChange={set("subject")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold">
                Message <span className="text-ooredoo-red">*</span>
              </label>
              <textarea
                required
                rows={6}
                className="input-field resize-none"
                placeholder="Describe your complaint, suggestion, or feedback in detail…"
                value={form.message}
                onChange={set("message")}
              />
            </div>
          </div>

          {status === "error" && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-ooredoo-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending to
                Firebase…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send feedback
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
