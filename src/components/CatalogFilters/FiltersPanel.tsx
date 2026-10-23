"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import styles from "./FiltersPanel.module.css";

export default function FiltersPanel({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    function updateScreen() {
      setIsMobile(media.matches);
    }

    updateScreen();
    media.addEventListener("change", updateScreen);

    return () => {
      media.removeEventListener("change", updateScreen);
    };
  }, []);

  return (
    <details
      className={styles.panel}
      open={!isMobile || isExpanded}
      onToggle={(event) => {
        if (isMobile) {
          setIsExpanded(event.currentTarget.open);
        }
      }}
    >
      <summary className={styles.toggle}>
        Filters
        <span className={styles.arrow} aria-hidden="true" />
      </summary>

      {children}
    </details>
  );
}
