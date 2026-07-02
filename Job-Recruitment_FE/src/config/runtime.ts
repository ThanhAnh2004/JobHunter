const normalizeBaseUrl = (value?: string) => {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return "";
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

export const BACKEND_URL =
    import.meta.env.VITE_USE_PROXY === "true"
        ? ""
        : normalizeBaseUrl(import.meta.env.VITE_BACKEND_URL as string | undefined);

export const withBackendUrl = (path: string) => `${BACKEND_URL}${path}`;
