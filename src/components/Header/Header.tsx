"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCatalog = pathname === "/catalog" || pathname.startsWith("/catalog/");

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
      </nav>
    </header>
  );
}
