export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function normalizeBusinessHours(hours: string): string {
  return hours
    .trim()
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://")) {
    return trimmed.replace("http://", "https://");
  }
  if (!trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
