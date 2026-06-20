import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Nav } from "@/components/Nav";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DESCRIPTION =
  "Borrow tools, camping gear, party supplies, instruments and more from verified neighbours near you. Canada's neighbourhood rental marketplace.";

export const metadata: Metadata = {
  title: "Borrow — Rent anything from a neighbour in Toronto",
  description: DESCRIPTION,
  openGraph: {
    title: "Borrow — Rent anything from a neighbour in Toronto",
    description: DESCRIPTION,
    type: "website",
    siteName: "Borrow",
    url: "https://borrow-marketplace-poc.netlify.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Borrow — Rent anything from a neighbour in Toronto",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        <ToastProvider>
          <Nav />
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}
