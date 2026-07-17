function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Deterministic pseudo-rating (4.3 - 5.0) derived from an item id, stable across renders/SSR. */
export function getMenuItemRating(id: string): number {
  const h = hashString(id);
  return Math.round((4.3 + (h % 71) / 100) * 10) / 10;
}

/** Deterministic pseudo review count (28 - 412) derived from an item id. */
export function getMenuItemReviewCount(id: string): number {
  const h = hashString(id + "reviews");
  return 28 + (h % 385);
}
