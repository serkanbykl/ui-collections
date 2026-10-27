/**
 * Filter for cmdk lists: every typed term must match the start of a word in
 * the item's value or keywords. Predictable for names and codes ("to" finds
 * Tokyo and Cape Town, not Washington), unlike cmdk's default fuzzy match.
 */
export function wordFilter(value: string, search: string, keywords?: string[]) {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 1;
  const words = [value, ...(keywords ?? [])].join(" ").toLowerCase().split(/[^\p{L}\p{N}]+/u);
  return terms.every((term) => words.some((word) => word.startsWith(term))) ? 1 : 0;
}
