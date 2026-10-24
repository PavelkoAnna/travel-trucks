"use client";

import Link from "next/link";
import { LuHeart } from "react-icons/lu";
import CamperCard from "@/components/CamperCard/CamperCard";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const { favorites, isReady } = useFavorites();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Your favorites</h1>

      {!isReady ? (
        <p role="status">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <div className={styles.empty}>
          <LuHeart className={styles.heart} size={56} aria-hidden="true" />

          <h2 className={styles.emptyTitle}>Your next adventure starts here</h2>

          <p className={styles.description}>
            Save campers you like by tapping the heart in the catalog.
          </p>

          <Link className={styles.button} href="/catalog">
            Explore campers
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.count} role="status">
            {favorites.length} saved{" "}
            {favorites.length === 1 ? "camper" : "campers"}
          </p>

          <ul className={styles.list}>
            {favorites.map((camper) => (
              <CamperCard key={camper.id} camper={camper} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
