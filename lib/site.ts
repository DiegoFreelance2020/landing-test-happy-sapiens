export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://test.happysapiens.co";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
