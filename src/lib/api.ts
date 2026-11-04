// src/lib/api.ts
import "server-only";
import { auth } from "@/lib/auth";

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

export function withAdmin<C>(handler: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ctx);
  };
}

export function apiError(err: unknown) {
  const e = err as { code?: number };
  if (e?.code === 11000) {
    return Response.json({ error: "Slug already exists" }, { status: 409 });
  }

  console.error("[api]", err);

  const showDetail =
    process.env.NODE_ENV !== "production" ||
    process.env.DEBUG_API_ERRORS === "true";

  return Response.json(
    {
      error: "Something went wrong",
      ...(showDetail ? { detail: String(err) } : {}),
    },
    { status: 500 },
  );
}
