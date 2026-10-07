"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, isAdminEmail } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (!isAdminEmail(currentUser.email)) {
        router.replace("/");
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, [router]);

  if (checking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ooredoo-mist">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-ooredoo-red" />
          <p className="text-sm font-medium">Vérification des accès…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
