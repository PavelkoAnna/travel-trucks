import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Campers Catalog",
  description:
    "Explore available campers. Filter by location, vehicle type, engine, and transmission to find your perfect match.",
};

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
