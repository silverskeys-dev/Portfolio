export function publicPath(input: string | undefined | null): string {
  const value = (input ?? "").trim();
  if (!value) return "";

  // Leave remote/data URLs untouched.
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;

  const rawBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  const base = rawBase && rawBase !== "/" ? `/${rawBase.replace(/^\/+|\/+$/g, "")}` : "";

  if (!base) return value;

  // Already prefixed
  if (value === base || value.startsWith(`${base}/`)) return value;

  if (value.startsWith("/")) return `${base}${value}`;

  return `${base}/${value}`;
}
