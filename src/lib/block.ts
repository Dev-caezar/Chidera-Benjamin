// src/lib/blocks.ts
import type { ImageBlock } from "@/types/project";

export function toBlocks(value: unknown): ImageBlock[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const v = item as Record<string, unknown>;

    const url =
      typeof v.url === "string"
        ? v.url
        : typeof v.image === "string"
          ? v.image
          : "";
    if (!url) return [];

    const alt = [v.alt, v.name, v.phase].find(
      (x): x is string => typeof x === "string" && x.length > 0,
    );

    return [
      {
        url,
        alt: alt ?? "",
        caption: typeof v.caption === "string" ? v.caption : "",
      },
    ];
  });
}
