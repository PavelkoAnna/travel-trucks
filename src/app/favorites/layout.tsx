import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Keep your favorite campers together and plan your next trip.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
