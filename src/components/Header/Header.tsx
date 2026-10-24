"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { favorites, isReady } = useFavorites();

  const isHome = pathname === "/";
  const isCatalog = pathname === "/catalog" || pathname.startsWith("/catalog/");
  const isFavorites = pathname === "/favorites";

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
          {isReady && favorites.length > 0 && (
            <span className={styles.count}>
              <span className={styles.visuallyHidden}>Saved campers:</span>
              {favorites.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
