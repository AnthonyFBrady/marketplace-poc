import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Borrow — Rent anything from a neighbour in Toronto",
  description:
    "Borrow tools, camping gear, party supplies, instruments and more from verified neighbours near you. Canada's neighbourhood rental marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${dmSans.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
