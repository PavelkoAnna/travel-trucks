import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header/Header";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const title = "TravelTrucks — Camper Rental";

const description =
  "Find your perfect camper with TravelTrucks. Browse campervans, compare features, read reviews, and send a booking request.";

export const metadata: Metadata = {
  metadataBase: new URL("https://travel-trucks-gules-chi.vercel.app"),

  title: {
    default: title,
    template: "%s | TravelTrucks",
  },

  description,

  authors: [
    {
      name: "Anna Pavelko",
      url: "https://github.com/PavelkoAnna",
    },
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TravelTrucks",
    title,
    description,
    images: [
      {
        url: "/hero.jpg",
        alt: "TravelTrucks campervan by a lake",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
