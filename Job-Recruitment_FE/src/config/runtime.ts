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

export const DEFAULT_COMPANY_LOGO = 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%23eff6ff'/%3E%3Cpath d='M30 75V35l20-10 20 10v40H55V55H45v20H30z' fill='%233b82f6'/%3E%3Crect x='36' y='42' width='6' height='6' rx='1' fill='%23ffffff'/%3E%3Crect x='58' y='42' width='6' height='6' rx='1' fill='%23ffffff'/%3E%3Crect x='36' y='52' width='6' height='6' rx='1' fill='%23ffffff'/%3E%3Crect x='58' y='52' width='6' height='6' rx='1' fill='%23ffffff'/%3E%3C/svg%3E";

export const getCompanyLogoUrl = (logoName?: string) => {
    if (!logoName || !logoName.trim()) {
        return DEFAULT_COMPANY_LOGO;
    }
    const clean = logoName.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
        return clean;
    }
    return withBackendUrl(`/storage/company/${clean}`);
};
