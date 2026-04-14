import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

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

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}>
      <body>
        {session && (
          <div className="fixed top-3 right-4 z-50">
            <SignOutButton />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
