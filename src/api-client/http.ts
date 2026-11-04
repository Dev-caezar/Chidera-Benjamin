export class ApiError extends Error {
  status: number;
  url: string;
  body: unknown;

  constructor(message: string, status: number, url: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function request<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const method = init.method ?? "GET";
  const hasJsonBody =
    init.body !== undefined && !(init.body instanceof FormData);

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: {
        ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch (err) {
    throw new ApiError(
      "Network error. The request never reached the server.",
      0,
      url,
      String(err),
    );
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      isRecord(data) && typeof data.error === "string"
        ? data.error
        : `${method} ${url} failed (${res.status})`;

    if (process.env.NODE_ENV !== "production") {
      console.error(`[api] ${method} ${url} → ${res.status}`, data);
    }
    throw new ApiError(message, res.status, url, data);
  }

  return data as T;
}
