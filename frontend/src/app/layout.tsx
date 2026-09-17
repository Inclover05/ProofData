import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const editorial = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProofData | Reliance Layer",
  description: "ProofData determines whether exact evidence is sufficient to rely on for a specific intended action.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}>
    <div className="site"><div className="environment" aria-hidden="true"/>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">Skip to content</a>
      <header className="site-header container"><div className="nav-shell glass">
        <Link href="/" className="wordmark" aria-label="ProofData home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M3 17C3 5 19 2 21 12M6 20C4 8 17 5 18 13M10 21C7 12 14 8 15 13M14 21c-3-3-3-6-2-8M18 20c-3-2-4-4-4-6"/></svg>ProofData</Link>
        <nav className="nav-links" aria-label="Main navigation"><Link href="/create" aria-label="Create Warrant">Create</Link><Link href="/compare">Compare</Link></nav>
        <span className="network-indicator"><span className="status-light" aria-hidden="true"/>BRADBURY / 4221</span>
        <Link href="/create#wallet" className="wallet-link">Wallet <span aria-hidden="true">↗</span></Link>
      </div></header>
      <main className="site-main" id="main-content">{children}</main>
      <footer className="site-footer container"><span>ProofData — The Reliance Layer</span><span>Bradbury Testnet · Validator-backed judgment · <Link href="/compare">Explore the proof ↗</Link></span></footer>
    </div>
  </body></html>;
}
