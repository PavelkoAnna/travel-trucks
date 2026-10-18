import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCamperById } from "@/lib/campers-api";

interface CamperLayoutProps {
  children: ReactNode;
  params: Promise<{ camperId: string }>;
}

export async function generateMetadata({
  params,
}: CamperLayoutProps): Promise<Metadata> {
  const { camperId } = await params;

  try {
    const camper = await getCamperById(camperId);

    return {
      title: {
        absolute: `${camper.name} | TravelTrucks`,
      },
      description: camper.description,
    };
  } catch {
    return {
      title: {
        absolute: "Camper Details | TravelTrucks",
      },
      description: "Explore camper features and send a booking request.",
    };
  }
}

export default function CamperLayout({ children }: CamperLayoutProps) {
  return <>{children}</>;
}
