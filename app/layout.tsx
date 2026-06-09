import type { Metadata } from "next";
import { Fira_Sans, Unbounded } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surwash-blog-website.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SURWASH Program Newsletter",
    template: "%s | SURWASH Program Newsletter",
  },
  description: "Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program Newsletter. Real-time updates, field assessments, and strategic briefings from Nigeria.",
  keywords: [
    "WASH",
    "Water Supply",
    "Sanitation",
    "Hygiene",
    "SURWASH",
    "Nigeria",
    "World Bank",
    "Federal Ministry of Water Resources",
    "Clean Water",
    "Urban Water",
    "Rural Water"
  ],
  authors: [{ name: "Federal Ministry of Water Resources, Nigeria" }],
  creator: "Federal Ministry of Water Resources, Nigeria",
  publisher: "Federal Ministry of Water Resources, Nigeria",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: baseUrl,
    siteName: "SURWASH Program Newsletter",
    title: "SURWASH Program Newsletter",
    description: "Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program Newsletter. Real-time updates, field assessments, and strategic briefings from Nigeria.",
    images: [
      {
        url: "/brand/logo/SVG/SURWASH Logo.svg",
        width: 800,
        height: 600,
        alt: "SURWASH Program Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SURWASH Program Newsletter",
    description: "Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program Newsletter. Real-time updates, field assessments, and strategic briefings from Nigeria.",
    images: ["/brand/logo/SVG/SURWASH Logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700;800&family=Unbounded:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${firaSans.variable} ${unbounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
