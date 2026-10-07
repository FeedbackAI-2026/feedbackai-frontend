"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isAdminEmail } from "@/lib/firebase";
import { LayoutDashboard, Loader2, LogOut, UserRound } from "lucide-react";

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <Loader2 className="h-4 w-4 animate-spin text-slate-300" />;
  }

  if (!user) {
    return (
      <>
        <Link
          href="/login"
          className="btn-outline !px-5 !py-2 hidden sm:inline-flex"
        >
          <UserRound className="h-4 w-4" />
          Log in
        </Link>
        <Link
          href="/signup"
          className="btn-primary !px-5 !py-2 hidden sm:inline-flex"
        >
          Sign up
        </Link>
      </>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      {isAdminEmail(user.email) && (
        <Link
          href="/admin"
          className="btn-primary !px-4 !py-2"
          title="Admin dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
      )}
      <span className="hidden max-w-[140px] truncate text-xs font-medium text-slate-500 lg:inline">
        {user.email}
      </span>
      <button
        onClick={() => signOut(auth)}
        className="btn-outline !px-4 !py-2"
        title="Log out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
