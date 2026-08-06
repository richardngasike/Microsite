"use client";

import { useEffect, useState, useMemo } from "react";
import PageHero from "@/components/PageHero";
import DocumentCard from "@/components/DocumentCard";
import { getRegions, getRoadmapsByCountry } from "@/lib/api";
import styles from "./roadmaps.module.css";

export default function SustainabilityRoadmapsPage() {
  const [regions, setRegions]               = useState(null);
  const [openRegion, setOpenRegion]         = useState(null);
  const [openCountry, setOpenCountry]       = useState(null);
  const [roadmapCache, setRoadmapCache]     = useState({});  // slug → doc[]
  const [loadingDocs, setLoadingDocs]       = useState(false);
  const [query, setQuery]                   = useState("");

  useEffect(() => {
    getRegions().then((d) => setRegions(Array.isArray(d) ? d : []));
  }, []);

  /* ── Toggle region ───────────────────────────────────────────────────── */
  const toggleRegion = (slug) => {
    setOpenRegion((prev) => (prev === slug ? null : slug));
    setOpenCountry(null);
  };

  /* ── Select country → fetch its roadmap docs ─────────────────────────── */
  const selectCountry = async (slug) => {
    if (openCountry === slug) { setOpenCountry(null); return; }
    setOpenCountry(slug);
    if (roadmapCache[slug] !== undefined) return; // already cached
    setLoadingDocs(true);
    const docs = await getRoadmapsByCountry(slug);
    setRoadmapCache((prev) => ({ ...prev, [slug]: Array.isArray(docs) ? docs : [] }));
    setLoadingDocs(false);
  };

  /* ── Filter regions/countries by search query ────────────────────────── */
  const filtered = useMemo(() => {
    if (!regions) return [];
    const q = query.trim().toLowerCase();
    if (!q) return regions;
    return regions
      .map((r) => ({
        ...r,
        countries: (r.countries || []).filter((c) =>
          c.name.toLowerCase().includes(q)
        ),
      }))
      .filter((r) => r.countries.length > 0);
  }, [regions, query]);

  const currentRegion = openRegion
    ? filtered.find((r) => r.slug === openRegion)
    : null;

  const currentDocs = openCountry ? (roadmapCache[openCountry] ?? null) : null;

  return (
    <>
      <PageHero
        eyebrow="Sustainability Roadmaps"
        title="Country roadmaps to sustainability"
      />

      <div className={`container ${styles.wrap}`}>

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div className={styles.intro}>
          <p>
            The country document page includes{" "}
            <strong>
              country profiles, which are an analytical resource package useful
              when considering the country's sustainability landscape.
            </strong>{" "}
            Additionally, this page hosts{" "}
            <strong>
              finalized country-specific sustainability roadmaps, "part A" –
              synthesis roadmap and "part B" – transformation plan.
            </strong>{" "}
            The analytical resource package draws on datasets which countries
            have submitted to UNAIDS, the Global Fund and PEPFAR and is{" "}
            <strong>
              meant to be a "conversation starter" for the Sustainability
              Dialogues, as well as to support the qualitative and quantitative
              assessments.
            </strong>{" "}
            However, the resource package is not exhaustive and may not include
            all the data and analysis needed for an evidence-informed dialogue.
            The vision of the new HIV response sustainability approach is to
            "galvanize efforts and to drive sustainable HIV response
            transformations to reach and maintain epidemic control beyond 2030,
            by upholding the right to health for all". Various countries are at
            different stages of elaborating these long-term sustainability
            roadmaps.{" "}
            <strong>
              With support from UNAIDS and partners, more than 30 countries have
              shown great leadership to develop nationally owned roadmaps.
            </strong>{" "}
            Several of these roadmaps have been endorsed and can be found through
            the country tabs below. These include Benin, Botswana, Eswatini,
            Ghana, Kenya, Lesotho, Malawi, Namibia, Tanzania and Zanzibar, Togo,
            and Zambia. As more become available this page will act as a
            repository.
          </p>
        </div>

        {/* ── Search row ─────────────────────────────────────────────────── */}
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              placeholder="Search countries…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenRegion(null);
                setOpenCountry(null);
              }}
              aria-label="Search countries"
            />
          </div>
          {openRegion && (
            <button
              className={styles.backBtn}
              onClick={() => { setOpenRegion(null); setOpenCountry(null); }}
            >
              ← All regions
            </button>
          )}
        </div>

        {/* ── States ─────────────────────────────────────────────────────── */}
        {regions === null && (
          <p className={styles.state}>Loading regions…</p>
        )}
        {regions !== null && filtered.length === 0 && (
          <p className={styles.state}>
            {query
              ? `No countries match "${query}".`
              : "Regions and countries will appear here once added from the admin."}
          </p>
        )}

        {/* ── View 1: Region cards ───────────────────────────────────────── */}
        {!openRegion && filtered && (
          <div className={styles.regionGrid}>
            {filtered.map((region) => (
              <button
                key={region.slug}
                className={styles.regionCard}
                onClick={() => toggleRegion(region.slug)}
                aria-expanded={openRegion === region.slug}
              >
                <div className={styles.regionCardIcon}>
                  <MapIcon />
                </div>
                <div className={styles.regionCardBody}>
                  <span className={styles.regionCardName}>{region.name}</span>
                  <span className={styles.regionCardCount}>
                    {(region.countries || []).length}{" "}
                    {(region.countries || []).length === 1 ? "country" : "countries"}
                  </span>
                </div>
                <ChevronIcon />
              </button>
            ))}
          </div>
        )}

        {/* ── View 2: Region → country list ─────────────────────────────── */}
        {openRegion && currentRegion && (
          <div className={styles.regionDetail}>
            <div className={styles.regionDetailHeader}>
              <div className={styles.regionDetailIcon}><MapIcon /></div>
              <div>
                <h2 className={styles.regionDetailName}>{currentRegion.name}</h2>
                <span className={styles.regionDetailCount}>
                  {(currentRegion.countries || []).length} countries — select one to view roadmaps
                </span>
              </div>
            </div>

            <div className={styles.countryGrid}>
              {(currentRegion.countries || []).map((c) => (
                <button
                  key={c.slug}
                  className={`${styles.countryCard} ${
                    openCountry === c.slug ? styles.countryCardActive : ""
                  }`}
                  onClick={() => selectCountry(c.slug)}
                  aria-expanded={openCountry === c.slug}
                >
                  {c.flag_url && (
                    <img src={c.flag_url} alt="" className={styles.countryFlag} />
                  )}
                  <span className={styles.countryName}>{c.name}</span>
                  <span className={styles.countryChevron}>
                    <ChevronIcon down={openCountry === c.slug} />
                  </span>
                </button>
              ))}
            </div>

            {/* ── View 3: Roadmap documents panel ──────────────────────── */}
            {openCountry && (
              <div className={styles.documentsPanel}>
                {/* Header */}
                <div className={styles.documentsPanelHeader}>
                  {(() => {
                    const c = (currentRegion.countries || []).find(
                      (x) => x.slug === openCountry
                    );
                    return (
                      <>
                        {c?.flag_url && (
                          <img
                            src={c.flag_url}
                            alt=""
                            className={styles.docPanelFlag}
                          />
                        )}
                        <div>
                          <h3 className={styles.documentsPanelTitle}>
                            {c?.name} — Sustainability Roadmaps
                          </h3>
                          <p className={styles.documentsPanelSub}>
                            Published roadmap documents for this country
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Loading */}
                {loadingDocs && currentDocs === null && (
                  <p className={styles.state}>Loading roadmaps…</p>
                )}

                {/* Empty */}
                {!loadingDocs && currentDocs !== null && currentDocs.length === 0 && (
                  <div className={styles.emptyDocs}>
                    <FileIcon />
                    <p>No roadmap documents published for this country yet.</p>
                    <span>
                      Check back soon — roadmaps are added as they are endorsed
                      and finalised.
                    </span>
                  </div>
                )}

                {/* Documents grid */}
                {currentDocs !== null && currentDocs.length > 0 && (
                  <div className={styles.docsGrid}>
                    {currentDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ── SVG icons ───────────────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m0 16l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronIcon({ down }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ transform: down ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 220ms ease" }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}