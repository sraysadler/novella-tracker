import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import SearchBar from "@/components/SearchBar";
import { getUserRole } from "@/lib/role";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novella Tracker",
  description: "A personal reading tracker for the 100 Greatest Novellas reading plan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const role = session ? await getUserRole(supabase) : null;

  const roleBadge = role === "admin"
    ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-900/80 text-red-100">Admin</span>
    : role === "editor"
    ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-800/70 text-blue-100">Editor</span>
    : null;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}>
      <body>
        <header className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link
              href="/"
              className="font-serif font-bold text-stone-900 dark:text-stone-50 flex-shrink-0 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
            >
              Novella Tracker
            </Link>
            <div className="flex-1 max-w-xs sm:max-w-sm">
              <SearchBar />
            </div>
            {session && (
              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                {roleBadge}
                <SignOutButton />
              </div>
            )}
          </div>
        </header>
        {children}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-6 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center text-sm text-stone-500 dark:text-stone-400">
            <a
              href="/best-contemporary-novels-under-200-pages.html"
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Best Contemporary Novels Under 200 Pages →
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
