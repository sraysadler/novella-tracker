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
  const role = session ? await getUserRole() : null;
  console.log('User role:', role);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}>
      <body>
        {session && (
          <div className="fixed top-3 right-4 z-50 flex items-center gap-3">
            {role === 'admin' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-100 font-medium">
                Admin
              </span>
            )}
            {role === 'editor' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-800 text-blue-100 font-medium">
                Editor
              </span>
            )}
            <SignOutButton />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
