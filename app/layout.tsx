import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DigitalTwinChat } from "../components/DigitalTwinChat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boopathi Thangamani | Lead Engineer",
  description:
    "Personal website of Boopathi Thangamani, focused on engineering leadership, scalable products, and future portfolio case studies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <DigitalTwinChat />
      </body>
    </html>
  );
}
