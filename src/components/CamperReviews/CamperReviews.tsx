"use client";

import { useQuery } from "@tanstack/react-query";
import { getCamperReviews } from "@/lib/campers-api";
import styles from "./CamperReviews.module.css";
import { FaStar } from "react-icons/fa";

interface CamperReviewsProps {
  camperId: string;
}

export default function CamperReviews({ camperId }: CamperReviewsProps) {
  const {
    data: reviews,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["camper-reviews", camperId],
    queryFn: ({ signal }) => getCamperReviews(camperId, signal),
  });

  if (isPending) {
    return <p role="status">Loading reviews...</p>;
  }

  if (isError) {
    return (
      <div>
        <p role="alert">{error.message}</p>

        <button type="button" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Loading..." : "Try again"}
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <li key={review.id}>
          <div className={styles.heading}>
            <span className={styles.avatar} aria-hidden="true">
              {review.reviewer_name.trim().charAt(0).toUpperCase()}
            </span>

            <div>
              <h3 className={styles.name}>{review.reviewer_name}</h3>

              <div
                className={styles.stars}
                role="img"
                aria-label={`${review.reviewer_rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    size={16}
                    className={
                      index < review.reviewer_rating
                        ? styles.filledStar
                        : styles.emptyStar
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className={styles.comment}>{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
