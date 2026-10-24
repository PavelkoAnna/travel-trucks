"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { Camper } from "@/types/camper";

const STORAGE_KEY = "travel-trucks-favorites";

interface FavoritesContextValue {
  favorites: Camper[];
  isReady: boolean;
  toggleFavorite: (camper: Camper) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function isCamper(value: unknown): value is Camper {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const camper = value as Record<string, unknown>;

  return (
    typeof camper.id === "string" &&
    typeof camper.name === "string" &&
    typeof camper.price === "number" &&
    Number.isFinite(camper.price) &&
    typeof camper.rating === "number" &&
    Number.isFinite(camper.rating) &&
    typeof camper.location === "string" &&
    typeof camper.description === "string" &&
    typeof camper.form === "string" &&
    typeof camper.length === "string" &&
    typeof camper.width === "string" &&
    typeof camper.height === "string" &&
    typeof camper.tank === "string" &&
    typeof camper.consumption === "string" &&
    typeof camper.transmission === "string" &&
    typeof camper.engine === "string" &&
    Array.isArray(camper.amenities) &&
    camper.amenities.every((item) => typeof item === "string") &&
    typeof camper.createdAt === "string" &&
    typeof camper.updatedAt === "string" &&
    typeof camper.coverImage === "string" &&
    typeof camper.totalReviews === "number" &&
    Number.isFinite(camper.totalReviews)
  );
}

function readFavorites(): Camper[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const validCampers = parsed.filter(isCamper);

    return Array.from(
      new Map(validCampers.map((camper) => [camper.id, camper])).values(),
    );
  } catch {
    return [];
  }
}

const emptyFavorites: Camper[] = [];

let favoritesSnapshot: Camper[] | null = null;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return favoritesSnapshot;
}

function getServerSnapshot(): Camper[] | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (favoritesSnapshot === null) {
    favoritesSnapshot = readFavorites();
    notifyListeners();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      favoritesSnapshot = readFavorites();
      notifyListeners();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function toggleFavorite(camper: Camper) {
  if (favoritesSnapshot === null) {
    return;
  }

  const alreadySaved = favoritesSnapshot.some((item) => item.id === camper.id);

  favoritesSnapshot = alreadySaved
    ? favoritesSnapshot.filter((item) => item.id !== camper.id)
    : [...favoritesSnapshot, camper];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesSnapshot));
  } catch {
    // Keep favorites in memory if browser storage is unavailable.
  }

  notifyListeners();
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites: snapshot ?? emptyFavorites,
        isReady: snapshot !== null,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider.");
  }

  return context;
}
