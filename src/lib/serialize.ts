// src/lib/serialize.ts
const PROTECTED = ["_id", "__v", "key", "createdAt", "updatedAt"];

export function serialize<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value));
}

export function omitProtected<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !PROTECTED.includes(key)),
  ) as Partial<T>;
}
