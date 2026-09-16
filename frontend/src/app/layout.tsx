import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProofData | Reliance Layer",
  description: "ProofData determines whether exact evidence is sufficient to rely on for a specific intended action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col selection:bg-accent selection:text-white`}>
        <header className="sticky top-0 z-50 premium-glass border-b border-glass-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-accent">
                <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              ProofData
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/create" className="text-text-secondary hover:text-text-primary transition-colors">Create Warrant</Link>
              <Link href="/compare" className="text-text-secondary hover:text-text-primary transition-colors">Compare</Link>
              <Link href="/warrant/demo" className="text-text-secondary hover:text-text-primary transition-colors">Proof Warrant</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex flex-col relative w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
