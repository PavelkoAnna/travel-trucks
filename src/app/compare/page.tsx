"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { LuCheck, LuMinus, LuScale, LuX } from "react-icons/lu";
import { MAX_COMPARE, useCompare } from "@/context/CompareContext";
import type { Camper } from "@/types/camper";
import styles from "./page.module.css";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToScreen(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);

  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

const formLabels: Record<string, string> = {
  alcove: "Alcove",
  panel_van: "Panel Van",
  integrated: "Integrated",
  semi_integrated: "Semi Integrated",
};

const amenityLabels: Record<string, string> = {
  ac: "Air conditioning",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  tv: "TV",
  radio: "Radio",
  refrigerator: "Refrigerator",
  microwave: "Microwave",
  gas: "Gas",
  water: "Water",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const specificationRows: {
  key: string;
  label: string;
  getValue: (camper: Camper) => string;
}[] = [
  {
    key: "price",
    label: "Price",
    getValue: (camper) => `€${camper.price}`,
  },
  {
    key: "rating",
    label: "Rating",
    getValue: (camper) =>
      `${camper.rating.toFixed(1)} / 5 (${camper.totalReviews} reviews)`,
  },
  {
    key: "location",
    label: "Location",
    getValue: (camper) => camper.location,
  },
  {
    key: "form",
    label: "Vehicle type",
    getValue: (camper) => formLabels[camper.form] ?? camper.form,
  },
  {
    key: "engine",
    label: "Engine",
    getValue: (camper) => capitalize(camper.engine),
  },
  {
    key: "transmission",
    label: "Transmission",
    getValue: (camper) => capitalize(camper.transmission),
  },
  {
    key: "length",
    label: "Length",
    getValue: (camper) => camper.length,
  },
  {
    key: "width",
    label: "Width",
    getValue: (camper) => camper.width,
  },
  {
    key: "height",
    label: "Height",
    getValue: (camper) => camper.height,
  },
  {
    key: "tank",
    label: "Tank / battery",
    getValue: (camper) => camper.tank,
  },
  {
    key: "consumption",
    label: "Consumption",
    getValue: (camper) => camper.consumption,
  },
];

export default function ComparePage() {
  const { comparison, isReady, removeFromCompare, clearComparison } =
    useCompare();

  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedPair, setSelectedPair] = useState<[string, string]>(["", ""]);

  const isMobile = useSyncExternalStore(
    subscribeToScreen,
    getMobileSnapshot,
    getServerSnapshot,
  );

  const firstCamper =
    comparison.find((camper) => camper.id === selectedPair[0]) ?? comparison[0];

  const secondCamper =
    comparison.find(
      (camper) =>
        camper.id === selectedPair[1] && camper.id !== firstCamper?.id,
    ) ?? comparison.find((camper) => camper.id !== firstCamper?.id);

  const mobileCampers = [firstCamper, secondCamper].filter(
    (camper): camper is Camper => camper !== undefined,
  );

  const displayedCampers = isMobile ? mobileCampers : comparison;

  const amenities = Array.from(
    new Set(displayedCampers.flatMap((camper) => camper.amenities)),
  );

  function changePair(index: number, camperId: string) {
    const currentPair: [string, string] = [
      firstCamper?.id ?? "",
      secondCamper?.id ?? "",
    ];

    currentPair[index] = camperId;
    setSelectedPair(currentPair);
  }

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>Compare campers</h1>
          <p className={styles.description}>
            Find the right fit for your next trip.
          </p>
        </div>

        {isReady && comparison.length > 0 && (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={clearComparison}
          >
            <LuX size={18} aria-hidden="true" />
            Clear comparison
          </button>
        )}
      </div>

      {!isReady ? (
        <p role="status">Loading comparison...</p>
      ) : comparison.length === 0 ? (
        <div className={styles.empty}>
          <LuScale size={56} aria-hidden="true" />
          <h2>No campers selected</h2>
          <p>Tap Compare on camper cards to add up to three vehicles.</p>

          <Link className={styles.primaryButton} href="/catalog">
            Explore campers
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <p role="status">
              {comparison.length} of {MAX_COMPARE} campers selected
            </p>

            <div className={styles.toolbarActions}>
              <button
                className={`${styles.secondaryButton} ${styles.photoToggle}`}
                type="button"
                aria-pressed={showPhotos}
                onClick={() => setShowPhotos((previous) => !previous)}
              >
                {showPhotos ? "Hide photos" : "Show photos"}
              </button>

              {comparison.length < MAX_COMPARE && (
                <Link className={styles.secondaryButton} href="/catalog">
                  Add camper
                </Link>
              )}
            </div>
          </div>

          {comparison.length === 1 && (
            <p className={styles.notice}>
              Add one more camper to compare them side by side.
            </p>
          )}

          {isMobile && comparison.length > 2 && (
            <div className={styles.pairPanel}>
              <p className={styles.pairDescription}>
                Choose two campers to compare. Your third camper stays saved.
              </p>

              <div className={styles.pairSelectors}>
                {mobileCampers.map((camper, index) => (
                  <label className={styles.selectLabel} key={index}>
                    Camper {index + 1}
                    <select
                      className={styles.select}
                      value={camper.id}
                      onChange={(event) =>
                        changePair(index, event.target.value)
                      }
                    >
                      {comparison.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          disabled={option.id === mobileCampers[1 - index]?.id}
                        >
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.tableWrapper}>
            <table
              className={styles.table}
              role="table"
              style={
                {
                  "--compare-columns": displayedCampers.length,
                } as CSSProperties
              }
            >
              <caption className={styles.visuallyHidden}>
                Camper specifications and equipment compared side by side
              </caption>

              <colgroup className={styles.columns}>
                <col className={styles.labelColumn} />
                {displayedCampers.map((camper) => (
                  <col key={camper.id} />
                ))}
              </colgroup>

              <thead role="rowgroup">
                <tr role="row">
                  <th className={styles.corner} scope="col" role="columnheader">
                    Camper
                  </th>

                  {displayedCampers.map((camper) => (
                    <th
                      key={camper.id}
                      id={`camper-${camper.id}`}
                      scope="col"
                      role="columnheader"
                    >
                      <div className={styles.camperHeader}>
                        <div className={styles.photo} data-visible={showPhotos}>
                          <Image
                            className={styles.image}
                            src={camper.coverImage}
                            alt={camper.name}
                            width={300}
                            height={200}
                            sizes="(max-width: 767px) 45vw, (max-width: 1024px) 30vw, 350px"
                          />
                        </div>

                        <h2 className={styles.camperName}>{camper.name}</h2>

                        <Link
                          className={styles.detailsLink}
                          href={`/catalog/${camper.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View details
                          <span className={styles.visuallyHidden}>
                            {" "}
                            for {camper.name} (opens in a new tab)
                          </span>
                        </Link>

                        <button
                          className={styles.removeButton}
                          type="button"
                          aria-label={`Remove ${camper.name} from comparison`}
                          onClick={() => removeFromCompare(camper.id)}
                        >
                          <LuX size={16} aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody role="rowgroup">
                {specificationRows.map((row) => (
                  <tr role="row" key={row.key}>
                    <th id={`spec-${row.key}`} scope="row" role="rowheader">
                      {row.label}
                    </th>

                    {displayedCampers.map((camper) => (
                      <td
                        role="cell"
                        key={camper.id}
                        headers={`spec-${row.key} camper-${camper.id}`}
                      >
                        {row.getValue(camper)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

              <tbody role="rowgroup">
                <tr role="row" className={styles.sectionRow}>
                  <th
                    className={styles.sectionHeading}
                    colSpan={displayedCampers.length + 1}
                  >
                    Equipment
                  </th>
                </tr>

                {amenities.map((amenity) => (
                  <tr role="row" key={amenity}>
                    <th id={`amenity-${amenity}`} scope="row" role="rowheader">
                      {amenityLabels[amenity] ?? capitalize(amenity)}
                    </th>

                    {displayedCampers.map((camper) => {
                      const available = camper.amenities.includes(amenity);

                      return (
                        <td
                          role="cell"
                          key={camper.id}
                          headers={`amenity-${amenity} camper-${camper.id}`}
                        >
                          {available ? (
                            <LuCheck
                              className={styles.available}
                              size={22}
                              aria-hidden="true"
                            />
                          ) : (
                            <LuMinus
                              className={styles.unavailable}
                              size={22}
                              aria-hidden="true"
                            />
                          )}

                          <span className={styles.visuallyHidden}>
                            {available ? "Available" : "Not available"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.note}>
            Saved specifications reflect the data when you selected each camper.
            Open its details page for current information.
          </p>
        </>
      )}
    </main>
  );
}
