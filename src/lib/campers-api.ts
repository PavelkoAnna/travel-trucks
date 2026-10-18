import type {
  BookingRequest,
  CamperDetails,
  CamperFilters,
  CamperReview,
  CampersResponse,
} from "@/types/camper";

const BASE_URL = "https://campers-api.goit.study";

export async function getCampers(
  page: number,
  filters: CamperFilters,
  signal?: AbortSignal,
): Promise<CampersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    perPage: "4",
  });

  if (filters.location.trim()) {
    params.set("location", filters.location.trim());
  }

  if (filters.form) {
    params.set("form", filters.form);
  }

  if (filters.transmission) {
    params.set("transmission", filters.transmission);
  }

  if (filters.engine) {
    params.set("engine", filters.engine);
  }

  const response = await fetch(`${BASE_URL}/campers?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load campers. Please try again.");
  }

  const data: CampersResponse = await response.json();

  return data;
}

export async function getCamperById(
  camperId: string,
  signal?: AbortSignal,
): Promise<CamperDetails> {
  const response = await fetch(
    `${BASE_URL}/campers/${encodeURIComponent(camperId)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Camper not found."
        : "Failed to load camper. Please try again.",
    );
  }

  const data: CamperDetails = await response.json();

  return data;
}

export async function getCamperReviews(
  camperId: string,
  signal?: AbortSignal,
): Promise<CamperReview[]> {
  const response = await fetch(
    `${BASE_URL}/campers/${encodeURIComponent(camperId)}/reviews`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Failed to load reviews. Please try again.");
  }

  const data: CamperReview[] = await response.json();

  return data;
}

export async function createBookingRequest(
  camperId: string,
  booking: BookingRequest,
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/campers/${encodeURIComponent(camperId)}/booking-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send your booking request. Please try again.");
  }
}
