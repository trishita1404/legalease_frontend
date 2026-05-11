import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap', // Ensures text remains visible during font load
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LegalEase+ | Professional Case Management",
  description: "Secure and efficient legal case and document management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          font-sans 
          flex flex-col 
          min-h-screen 
          bg-background 
          text-foreground 
          selection:bg-primary/10 
          selection:text-primary
        `}
      >
        <QueryProvider>

  <Navbar />

  <main className="pt-20 grow bg-background">
    <div className="max-w-360 mx-auto w-full px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </main>

  <Footer />

</QueryProvider>
      </body>
    </html>
  );
}