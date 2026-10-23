import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Campers Catalog | TravelTrucks";

const description =
  "Explore available campers. Filter by location, vehicle type, engine, and transmission to find your perfect match.";

export const metadata: Metadata = {
  title: "Campers Catalog",
  description,

  alternates: {
    canonical: "/catalog",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TravelTrucks",
    url: "/catalog",
    title,
    description,
    images: [
      {
        url: "/hero.jpg",
        alt: "Explore the TravelTrucks camper catalog",
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

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
