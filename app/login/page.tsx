"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <h1 className="font-lora text-2xl font-semibold text-stone-800 text-center mb-1">
          Novella Tracker
        </h1>
        <p className="text-stone-500 text-sm text-center mb-8">
          Your 100 Greatest Novellas reading plan
        </p>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-stone-700 text-sm leading-relaxed">
              Check your email — we sent you a sign-in link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
              {error && (
                <p className="mt-1 text-red-600 text-xs">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Sending…" : "Send me a sign-in link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
