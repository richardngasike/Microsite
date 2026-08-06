// API client. All data (documents, news, countries, GC8, analytics events)
// comes from the Django backend at NEXT_PUBLIC_API_URL.
//
// Because the frontend is a STATIC export, every fetch runs in the browser at
// runtime — not at build time. That keeps the export fully static while still
// showing live content. If the API is unreachable, callers get an empty result
// and the UI shows an empty state rather than crashing.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    // Network / server unavailable — return null so the UI can degrade cleanly.
    if (typeof window !== "undefined") {
      console.warn(`API request failed: ${url}`, err.message);
    }
    return null;
  }
}

// --- Documents & Resources -------------------------------------------------
export const getResources = (params = "") =>
  request(`/documents/${params}`).then((d) => d?.results ?? d ?? []);

export const getDocument = (slug) => request(`/documents/${slug}/`);

// Fired when a user opens/downloads a document — powers download analytics.
export const trackDownload = (id) =>
  request(`/documents/${id}/download/`, { method: "POST" });

// --- Technical guidance ----------------------------------------------------
export const getGuidance = () =>
  request(`/guidance/`).then((d) => d?.results ?? d ?? []);

// --- Sustainability Roadmaps -----------------------------------------------
// All roadmaps (used by the page summary / fallback).
export const getRoadmaps = () =>
  request(`/roadmaps/`).then((d) => d?.results ?? d ?? []);

// Roadmap documents for a specific country — used by the region→country→docs
// drill-down on the Sustainability Roadmaps page.
export const getRoadmapsByCountry = (countrySlug) =>
  request(`/roadmaps/?country=${encodeURIComponent(countrySlug)}`).then(
    (d) => d?.results ?? d ?? []
  );

// --- Countries & regions ---------------------------------------------------
export const getRegions = () =>
  request(`/regions/`).then((d) => d?.results ?? d ?? []);

export const getCountries = () =>
  request(`/countries/`).then((d) => d?.results ?? d ?? []);

export const getCountry = (slug) => request(`/countries/${slug}/`);

// --- GC8 (Global Fund Grant Cycle 8) --------------------------------------
export const getGC8 = () =>
  request(`/gc8/`).then((d) => d?.results ?? d ?? []);

// --- News / Blog -----------------------------------------------------------
export const getNews = (params = "") =>
  request(`/news/${params}`).then((d) => d?.results ?? d ?? []);

export const getPost = (slug) => request(`/news/${slug}/`);

// --- Advisory Committee ----------------------------------------------------
export const getAdvisoryMembers = () =>
  request(`/advisory-committee/`).then((d) => d?.results ?? d ?? []);

// --- FAQs ------------------------------------------------------------------
export const getFaqs = () =>
  request(`/faqs/`).then((d) => d?.results ?? d ?? []);

// --- People (added/managed entirely from Django admin) --------------------
export const getPeople = () =>
  request(`/people/`).then((d) => d?.results ?? d ?? []);

// --- Global search ---------------------------------------------------------
export const search = (q) =>
  request(`/search/?q=${encodeURIComponent(q)}`).then(
    (d) => d?.results ?? d ?? []
  );