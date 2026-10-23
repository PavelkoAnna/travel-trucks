import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TravelTrucks",
    url: "/",
    title: "TravelTrucks — Camper Rental",
    description:
      "Find your perfect camper with TravelTrucks. Browse campervans, compare features, read reviews, and send a booking request.",
    images: [
      {
        url: "/hero.jpg",
        alt: "TravelTrucks campervan by a lake",
      },
    ],
  },
};

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>Campers of your dreams</h1>

          <p className={styles.description}>
            You can find everything you want in our catalog
          </p>

          <Link href="/catalog" className={styles.button}>
            View Now
          </Link>
        </div>
      </section>
    </main>
  );
}
