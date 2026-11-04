// src/components/admin/ErrorState.tsx
"use client";

import { ApiError } from "@/api-client/http";

function hint(status?: number) {
    if (status === 0) return "The request never reached the server (network or DNS).";
    if (status === 401) return "Your session may have expired. Sign in again.";
    if (status === 404) return "No route matched this URL. Check the path in the Network tab.";
    if (status && status >= 500) return "The server threw an error. Check the response body and your terminal.";
    return "Open DevTools → Network and click the failed request.";
}

export default function ErrorState({
    error,
    onRetry,
}: {
    error: Error;
    onRetry: () => void;
}) {
    const api = error instanceof ApiError ? error : null;

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">{error.message}</p>
            {api && (
                <p className="mt-1 text-xs text-red-600">
                    {api.status || "No response"} · {api.url}
                </p>
            )}
            <p className="mt-3 text-xs text-red-600/80">{hint(api?.status)}</p>
            <button
                onClick={onRetry}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
            >
                Try again
            </button>
        </div>
    );
}