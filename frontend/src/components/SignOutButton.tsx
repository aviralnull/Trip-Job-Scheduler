
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Sign out failed. Please try again.");
      }

      router.replace("/signin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign out.");
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        title="Sign out"
        aria-label="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <LogOut size={17} />
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="absolute bottom-11 right-0 z-50 w-48 rounded-lg border border-rose-200 bg-white p-2 text-xs text-rose-700 shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
}
