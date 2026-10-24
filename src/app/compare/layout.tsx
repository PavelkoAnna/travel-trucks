import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Compare Campers",
  description:
    "Compare camper prices, dimensions, engines, and equipment side by side.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
