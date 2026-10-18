"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LuMap } from "react-icons/lu";
import { getCamperById } from "@/lib/campers-api";
import CamperGallery from "@/components/CamperGallery/CamperGallery";
import CamperReviews from "@/components/CamperReviews/CamperReviews";
import BookingForm from "@/components/BookingForm/BookingForm";
import styles from "./page.module.css";

const formLabels: Record<string, string> = {
  panel_van: "Panel van",
  integrated: "Integrated",
  semi_integrated: "Semi Integrated",
  alcove: "Alcove",
};

const amenityLabels: Record<string, string> = {
  ac: "AC",
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

function formatLocation(location: string) {
  const parts = location.split(",").map((part) => part.trim());

  return parts.length === 2 ? `${parts[1]}, ${parts[0]}` : location;
}

export default function CamperDetailsPage() {
  const { camperId } = useParams<{ camperId: string }>();

  const {
    data: camper,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["camper", camperId],
    queryFn: ({ signal }) => getCamperById(camperId, signal),
  });

  if (isPending) {
    return (
      <main className={styles.page} aria-busy="true">
        <p role="status">Loading camper...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <p role="alert">{error.message}</p>

        <button
          className={styles.retryButton}
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Loading..." : "Try again"}
        </button>
      </main>
    );
  }

  const features = [
    capitalize(camper.transmission),
    ...camper.amenities.map((amenity) => amenityLabels[amenity] ?? amenity),
    capitalize(camper.engine),
    formLabels[camper.form] ?? camper.form,
  ];

  return (
    <main className={styles.page}>
      <div className={styles.topLayout}>
        <div className={styles.galleryColumn}>
          <CamperGallery
            key={camper.id}
            images={camper.gallery}
            camperName={camper.name}
          />
        </div>

        <div className={styles.infoColumn}>
          <section className={styles.summary}>
            <h1 className={styles.title}>{camper.name}</h1>

            <div className={styles.meta}>
              <p>
                <span className={styles.star} aria-hidden="true">
                  ★
                </span>{" "}
                {camper.rating} ({camper.totalReviews} Reviews)
              </p>

              <p className={styles.location}>
                <LuMap size={16} aria-hidden="true" />
                {formatLocation(camper.location)}
              </p>
            </div>

            <p className={styles.price}>€{camper.price}</p>

            <p className={styles.description}>{camper.description}</p>
          </section>

          <section
            className={styles.features}
            aria-labelledby="vehicle-details"
          >
            <h2 className={styles.sectionTitle} id="vehicle-details">
              Vehicle details
            </h2>

            <ul className={styles.badges} aria-label="Camper features">
              {features.map((feature, index) => (
                <li className={styles.badge} key={`${feature}-${index}`}>
                  {feature}
                </li>
              ))}
            </ul>

            <dl className={styles.details}>
              <dt>Form</dt>
              <dd>{formLabels[camper.form] ?? camper.form}</dd>

              <dt>Length</dt>
              <dd>{camper.length}</dd>

              <dt>Width</dt>
              <dd>{camper.width}</dd>

              <dt>Height</dt>
              <dd>{camper.height}</dd>

              <dt>Tank</dt>
              <dd>{camper.tank}</dd>

              <dt>Consumption</dt>
              <dd>{camper.consumption}</dd>
            </dl>
          </section>
        </div>
      </div>

      <section
        className={styles.reviewsSection}
        aria-labelledby="reviews-heading"
      >
        <h2 className={styles.reviewsTitle} id="reviews-heading">
          Reviews
        </h2>

        <div className={styles.bottomLayout}>
          <div className={styles.reviewsColumn}>
            <CamperReviews camperId={camper.id} />
          </div>

          <BookingForm key={camper.id} camperId={camper.id} />
        </div>
      </section>
    </main>
  );
}
