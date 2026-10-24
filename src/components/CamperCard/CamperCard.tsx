"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { LuCar, LuFuel, LuHeart, LuMap, LuSettings } from "react-icons/lu";
import { useFavorites } from "@/context/FavoritesContext";
import type { Camper } from "@/types/camper";
import styles from "./CamperCard.module.css";

interface CamperCardProps {
  camper: Camper;
}

const formLabels: Record<string, string> = {
  alcove: "Alcove",
  panel_van: "Panel Van",
  integrated: "Integrated",
  semi_integrated: "Semi Integrated",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatLocation(location: string) {
  const parts = location.split(",").map((part) => part.trim());

  return parts.length === 2 ? `${parts[1]}, ${parts[0]}` : location;
}

export default function CamperCard({ camper }: CamperCardProps) {
  const { favorites, isReady, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some((item) => item.id === camper.id);

  return (
    <li className={styles.card}>
      <Image
        className={styles.image}
        src={camper.coverImage}
        alt={camper.name}
        width={220}
        height={240}
        sizes="(max-width: 767px) calc(100vw - 64px), 220px"
      />

      <div className={styles.content}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{camper.name}</h2>

          <div className={styles.priceActions}>
            <p className={styles.price}>€{camper.price}</p>

            <button
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.favoriteActive : ""
              }`}
              type="button"
              disabled={!isReady}
              aria-pressed={isFavorite}
              aria-label={`Save ${camper.name} to favorites`}
              onClick={() => toggleFavorite(camper)}
            >
              <LuHeart
                size={24}
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          <p className={styles.rating}>
            <FaStar className={styles.star} size={16} aria-hidden="true" />

            <span>
              {camper.rating.toFixed(1)}({camper.totalReviews} Reviews)
            </span>
          </p>

          <p className={styles.location}>
            <LuMap size={16} aria-hidden="true" />
            {formatLocation(camper.location)}
          </p>
        </div>

        <p className={styles.description}>{camper.description}</p>

        <ul className={styles.features} aria-label="Camper features">
          <li className={styles.feature}>
            <LuFuel size={20} aria-hidden="true" />
            {capitalize(camper.engine)}
          </li>

          <li className={styles.feature}>
            <LuSettings size={20} aria-hidden="true" />
            {capitalize(camper.transmission)}
          </li>

          <li className={styles.feature}>
            <LuCar size={20} aria-hidden="true" />
            {formLabels[camper.form] ?? camper.form}
          </li>
        </ul>

        <Link
          className={styles.button}
          href={`/catalog/${camper.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Show more
        </Link>
      </div>
    </li>
  );
}
