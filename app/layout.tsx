import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveBanner from "./components/LiveBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "canadiendragon — Streams & Content",
  description: "Official site for canadiendragon — live Twitch streams, schedule, and socials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}>
        <Header />
        <LiveBanner />

        <main className="w-full">
          <div className="max-w-6xl mx-auto px-6">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}
