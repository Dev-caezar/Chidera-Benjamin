export function formatProjectDate(dateString?: string): string {
  if (!dateString) return "Recently added";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently added";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
