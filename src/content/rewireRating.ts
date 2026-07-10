import generatedRating from "../generated/rewire-app-store-rating.json";

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
    return "rated on the app store";
  }
  return `${rating.toFixed(1)} out of 5`;
}

export function formatRatingCount(count: number | null) {
  if (typeof count !== "number") {
    return "app store reviews";
  }
  return `${new Intl.NumberFormat("en-GB").format(count)} ${count === 1 ? "rating" : "ratings"}`;
}
