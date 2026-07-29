import generatedRating from "../generated/rewire-app-store-rating.json";
import { rewireContent } from "./rewire";

export type RewireAppStoreRating = {
  rating: number | null;
  ratingCount: number | null;
  storeUrl: string;
  source: "apple-lookup" | "fallback";
  fetchedAt: string | null;
};

export const rewireAppStoreRating = generatedRating as RewireAppStoreRating;

export function formatRating(rating: number | null) {
  if (typeof rating !== "number") {
    return rewireContent.ratingLabels.unavailableRating;
  }
  return `${rating.toFixed(1)} ${rewireContent.ratingLabels.ratingSuffix}`;
}

export function formatRatingCount(count: number | null) {
  if (typeof count !== "number") {
    return rewireContent.ratingLabels.unavailableCount;
  }
  return `${new Intl.NumberFormat("en-GB").format(count)} ${
    count === 1
      ? rewireContent.ratingLabels.singularCount
      : rewireContent.ratingLabels.pluralCount
  }`;
}
