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
  const path = `/catalog/${encodeURIComponent(camperId)}`;

  try {
    const camper = await getCamperById(camperId);

    const title = `${camper.name} | TravelTrucks`;
    const description = camper.description;

    const firstImage = [...camper.gallery].sort((a, b) => a.order - b.order)[0];

    const image = firstImage?.original ?? "/hero.jpg";

    return {
      title: {
        absolute: title,
      },
      description,

      alternates: {
        canonical: path,
      },

      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "TravelTrucks",
        url: path,
        title,
        description,
        images: [
          {
            url: image,
            alt: camper.name,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    const title = "Camper Details | TravelTrucks";
    const description = "Explore camper features and send a booking request.";

    return {
      title: {
        absolute: title,
      },
      description,

      alternates: {
        canonical: path,
      },

      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "TravelTrucks",
        url: path,
        title,
        description,
        images: [
          {
            url: "/hero.jpg",
            alt: "TravelTrucks campervan",
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
  }
}

export default function CamperLayout({ children }: CamperLayoutProps) {
  return <>{children}</>;
}
