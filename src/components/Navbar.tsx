"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Search, Info, X } from "lucide-react";
import { useState } from "react";
import AuthButtons from "./AuthButtons";

const links = [
  { href: "/#particuliers", label: "Individuals" },
  { href: "/#entreprises", label: "Businesses" },
  { href: "/#offres", label: "Our offers" },
  { href: "/#services", label: "All about Ooredoo" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Top announcement strip */}
        <div className="bg-ooredoo-red overflow-hidden text-white">
          <div className="announcement-track flex w-max items-center py-1.5 text-[11px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-16 px-8">
              <span>Born for 5G</span>
              <span>No. 1 network in Algeria</span>
              <span>5G</span>
              <span>FeedbackAI — Intelligent customer feedback analysis</span>
            </div>

            <div className="flex items-center gap-16 px-8" aria-hidden="true">
              <span>Born for 5G</span>
              <span>No. 1 network in Algeria</span>
              <span>5G</span>
              <span>FeedbackAI — Intelligent customer feedback analysis</span>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold lowercase italic tracking-tight text-ooredoo-red">
                ooredoo<span className="not-italic">•</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-ooredoo-red"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                href="/feedback"
                className={`ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
                  pathname === "/feedback"
                    ? "bg-ooredoo-red text-white"
                    : "bg-red-50 text-ooredoo-red hover:bg-red-100"
                }`}
              >
                <MessageSquareText className="h-4 w-4 shrink-0" />
                Feedback
              </Link>

              <button
                type="button"
                onClick={() => setShowProjectInfo(true)}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Info className="h-4 w-4 shrink-0" />
                About
              </button>
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center md:flex">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search…"
                    className="w-44 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-ooredoo-red focus:bg-white"
                  />
                </div>
              </div>

              <AuthButtons />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-ooredoo-red"
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/feedback"
              className="whitespace-nowrap rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-ooredoo-red"
            >
              Feedback
            </Link>

            <button
              type="button"
              onClick={() => setShowProjectInfo(true)}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              About
            </button>

            <Link
              href="/login"
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Project information modal */}
      {showProjectInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowProjectInfo(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowProjectInfo(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="pr-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ooredoo-red">
                <span className="h-2 w-2 rounded-full bg-ooredoo-red" />
                ThirdUni Project
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                FeedbackAI
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                FeedbackAI is a project developed as part of the{" "}
                <span className="font-semibold text-slate-900">
                  ThirdUni AI Program
                </span>
                . The project focuses on using artificial intelligence to
                analyze customer feedback and help organizations respond to
                customer needs more efficiently.
              </p>
            </div>

            {/* Project overview */}
            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                About the project
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                FeedbackAI receives customer feedback, analyzes it using an
                AI-powered system, identifies key information such as sentiment,
                category and priority, and generates an appropriate response.
                The goal is to make customer support faster, more intelligent,
                and more responsive.
              </p>
            </div>

            {/* Team */}
            <div className="mt-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Team members
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    TLILANI AHMED ABDELILAH
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Katia Ait Rahmoune
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Oumniahiba
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Soumaya EL MIHNAOUI
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Guerrara FatimaZohra
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Developed as part of the ThirdUni AI Program. This project is an
                educational and collaborative initiative.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
