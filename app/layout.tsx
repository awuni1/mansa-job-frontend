import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Mansa Jobs | Find Your Dream Job in Africa",
  description: "Africa's premier job platform connecting talented professionals with top companies across the continent. Find tech jobs in Ghana, Nigeria, Kenya, South Africa and beyond.",
  keywords: ["jobs", "africa", "careers", "employment", "tech jobs", "remote work", "ghana", "nigeria", "kenya"],
  authors: [{ name: "Mansa Jobs" }],
  openGraph: {
    title: "Mansa Jobs | Find Your Dream Job in Africa",
    description: "Africa's premier job platform connecting talented professionals with top companies.",
    type: "website",
    locale: "en_US",
    siteName: "Mansa Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mansa Jobs",
    description: "Find your dream job in Africa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E3A8A' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0F1C' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          {/* Desktop Navbar */}
          <Navbar />

          {/* Main Content with bottom padding for mobile nav */}
          <main className="min-h-screen pb-mobile-nav">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </ErrorBoundary>
      </body>
    </html>
  );
}
