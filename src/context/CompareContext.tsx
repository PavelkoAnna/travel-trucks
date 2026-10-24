"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { Camper } from "@/types/camper";
import { isCamper } from "@/lib/is-camper";

const STORAGE_KEY = "travel-trucks-compare";

export const MAX_COMPARE = 3;

type ToggleCompareResult = "added" | "removed" | "limit" | "not-ready";

interface CompareContextValue {
  comparison: Camper[];
  isReady: boolean;
  toggleCompare: (camper: Camper) => ToggleCompareResult;
  removeFromCompare: (camperId: string) => void;
  clearComparison: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const emptyComparison: Camper[] = [];

let comparisonSnapshot: Camper[] | null = null;

const listeners = new Set<() => void>();

function readComparison(): Camper[] {
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
    ).slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return comparisonSnapshot;
}

function getServerSnapshot(): Camper[] | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (comparisonSnapshot === null) {
    comparisonSnapshot = readComparison();
    notifyListeners();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      comparisonSnapshot = readComparison();
      notifyListeners();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveComparison(nextComparison: Camper[]) {
  comparisonSnapshot = nextComparison;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextComparison));
  } catch {
    // Keep the selection in memory if storage is unavailable.
  }

  notifyListeners();
}

function toggleCompare(camper: Camper): ToggleCompareResult {
  if (comparisonSnapshot === null) {
    return "not-ready";
  }

  const alreadySelected = comparisonSnapshot.some(
    (item) => item.id === camper.id,
  );

  if (alreadySelected) {
    saveComparison(comparisonSnapshot.filter((item) => item.id !== camper.id));

    return "removed";
  }

  if (comparisonSnapshot.length >= MAX_COMPARE) {
    return "limit";
  }

  saveComparison([...comparisonSnapshot, camper]);

  return "added";
}

function removeFromCompare(camperId: string) {
  if (comparisonSnapshot === null) {
    return;
  }

  saveComparison(comparisonSnapshot.filter((item) => item.id !== camperId));
}

function clearComparison() {
  if (comparisonSnapshot === null) {
    return;
  }

  saveComparison([]);
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <CompareContext.Provider
      value={{
        comparison: snapshot ?? emptyComparison,
        isReady: snapshot !== null,
        toggleCompare,
        removeFromCompare,
        clearComparison,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used within CompareProvider.");
  }

  return context;
}
