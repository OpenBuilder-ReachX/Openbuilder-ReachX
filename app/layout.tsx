import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switch to Inter (Standard Pro)
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReachX – Agency OS",
  description: "Recruitment Agency Operating System: clarity, compliance, and revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-slate-900 antialiased overflow-x-hidden`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
