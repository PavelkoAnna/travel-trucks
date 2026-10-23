"use client";

import Image from "next/image";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LuX } from "react-icons/lu";
import { getCampers } from "@/lib/campers-api";
import CamperCard from "@/components/CamperCard/CamperCard";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import type { CamperFilters } from "@/types/camper";
import styles from "./page.module.css";

const initialFilters: CamperFilters = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<CamperFilters>(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["campers", filters],
    queryFn: ({ pageParam, signal }) => getCampers(pageParam, filters, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const campers = data?.pages.flatMap((page) => page.campers) ?? [];
  const isLoading = isPending || isFetchingNextPage;

  function clearFilters() {
    setFilters({ ...initialFilters });
    setFiltersKey((key) => key + 1);
  }

  return (
    <main className={styles.catalog}>
      <h1 className={styles.visuallyHidden}>Campers catalog</h1>

      <div className={styles.layout}>
        <aside aria-label="Catalog filters">
          <CatalogFilters key={filtersKey} onSearch={setFilters} />
        </aside>

        <section
          className={styles.results}
          aria-label="Campers"
          aria-busy={isLoading}
        >
          {isPending ? (
            <div className={styles.loadingPlaceholder} />
          ) : isError && !data ? (
            <div className={styles.errorState}>
              <p role="alert">{error.message}</p>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          ) : campers.length === 0 ? (
            <div className={styles.emptyState}>
              <Image
                className={styles.emptyImage}
                src="/no-campers.png"
                alt=""
                width={480}
                height={360}
                sizes="(max-width: 768px) 80vw, 480px"
              />

              <h2 className={styles.emptyTitle}>No campers found</h2>

              <p className={styles.emptyDescription}>
                We couldn’t find any campers that match your filters.
                <br />
                Try adjusting your search or clearing some filters.
              </p>

              <div className={styles.emptyActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={clearFilters}
                >
                  <LuX size={18} aria-hidden="true" />
                  Clear filters
                </button>

                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={clearFilters}
                >
                  View all campers
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {campers.map((camper) => (
                  <CamperCard key={camper.id} camper={camper} />
                ))}
              </ul>

              {isFetchNextPageError && (
                <p role="alert">
                  Could not load more campers. Please try again.
                </p>
              )}

              {hasNextPage && (
                <button
                  className={styles.loadMore}
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBox} role="status">
            <span className={styles.spinner} aria-hidden="true" />

            <h2 className={styles.loadingTitle}>Loading campers...</h2>

            <p className={styles.loadingDescription}>
              Please wait while we fetch the best
              <br />
              travel trucks for you
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
