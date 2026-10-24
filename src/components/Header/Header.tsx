"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const { favorites, isReady: favoritesReady } = useFavorites();
  const { comparison, isReady: comparisonReady } = useCompare();

  const isHome = pathname === "/";
  const isCatalog = pathname === "/catalog" || pathname.startsWith("/catalog/");
  const isFavorites = pathname === "/favorites";
  const isCompare = pathname === "/compare";

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="TravelTrucks home">
        Travel<span className={styles.logoAccent}>Trucks</span>
      </Link>

      <nav className={styles.nav} aria-label="Main navigation">
        <Link
          href="/"
          className={`${styles.navLink} ${isHome ? styles.active : ""}`}
          aria-current={isHome ? "page" : undefined}
        >
          Home
        </Link>

        <Link
          href="/catalog"
          className={`${styles.navLink} ${isCatalog ? styles.active : ""}`}
          aria-current={pathname === "/catalog" ? "page" : undefined}
        >
          Catalog
        </Link>

        <Link
          href="/favorites"
          className={`${styles.navLink} ${isFavorites ? styles.active : ""}`}
          aria-current={isFavorites ? "page" : undefined}
        >
          Favorites
          {favoritesReady && favorites.length > 0 && (
            <span className={styles.count}>
              <span className={styles.visuallyHidden}>Saved campers:</span>
              {favorites.length}
            </span>
          )}
        </Link>

        <Link
          href="/compare"
          className={`${styles.navLink} ${isCompare ? styles.active : ""}`}
          aria-current={isCompare ? "page" : undefined}
        >
          Compare
          {comparisonReady && comparison.length > 0 && (
            <span className={styles.count}>
              <span className={styles.visuallyHidden}>Selected campers:</span>
              {comparison.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
