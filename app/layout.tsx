import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
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
        {session && (
          <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
            {roleBadge}
            <SignOutButton />
          </div>
        )}
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
