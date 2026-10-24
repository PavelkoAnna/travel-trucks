import type { Camper } from "@/types/camper";

export function isCamper(value: unknown): value is Camper {
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
