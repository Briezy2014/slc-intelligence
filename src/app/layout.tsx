import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SkipLink } from "@/components/accessibility/skip-link";
import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SLC Intelligence",
    template: "%s | SLC Intelligence",
  },
  description: "The Intelligence Platform for Specialized Learning Classrooms",
  applicationName: "SLC Intelligence",
  authors: [{ name: "SLC Intelligence" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "SLC Intelligence",
    title: "SLC Intelligence",
    description: "The Intelligence Platform for Specialized Learning Classrooms",
    images: [{ url: "/brand/slc-logo.png", width: 512, height: 512, alt: "SLC Intelligence logo" }],
  },
  twitter: {
    card: "summary",
    title: "SLC Intelligence",
    description: "The Intelligence Platform for Specialized Learning Classrooms",
    images: ["/brand/slc-logo.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/slc-logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: appUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${sourceSerif.variable} antialiased`}>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
