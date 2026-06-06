export function normalizeImageUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("http://")) {
    return trimmed.replace("http://", "https://");
  }

  return trimmed;
}

export function normalizeImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images
    .map(normalizeImageUrl)
    .filter((url): url is string => Boolean(url));
}
