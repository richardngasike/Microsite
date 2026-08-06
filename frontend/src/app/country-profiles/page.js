"use client";

import { useEffect, useState, useMemo } from "react";
import PageHero from "@/components/PageHero";
import DocumentCard from "@/components/DocumentCard";
import { getRegions, getCountry } from "@/lib/api";
import styles from "./countries.module.css";

export default function CountryProfilesPage() {
  const [regions, setRegions]           = useState(null);
  const [openRegion, setOpenRegion]     = useState(null); // slug of expanded region
  const [openCountry, setOpenCountry]   = useState(null); // slug of selected country
  const [countryData, setCountryData]   = useState({});   // cache: slug → data
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [query, setQuery]               = useState("");

  useEffect(() => {
    getRegions().then((d) => setRegions(Array.isArray(d) ? d : []));
  }, []);

  /* ── Open / close a region card ──────────────────────────────────────── */
  const toggleRegion = (slug) => {
    setOpenRegion((prev) => (prev === slug ? null : slug));
    setOpenCountry(null); // reset country selection when switching region
  };

  /* ── Select a country → fetch its profile + documents ────────────────── */
  const selectCountry = async (slug) => {
    if (openCountry === slug) { setOpenCountry(null); return; }
    setOpenCountry(slug);
    if (countryData[slug]) return; // already cached
    setLoadingCountry(true);
    const data = await getCountry(slug);
    setCountryData((prev) => ({ ...prev, [slug]: data || null }));
    setLoadingCountry(false);
  };

  /* ── Global country search (filters all regions) ─────────────────────── */
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

  const currentCountry = openCountry ? countryData[openCountry] : null;
  const currentRegion  = openRegion
    ? filtered.find((r) => r.slug === openRegion)
    : null;

  return (
    <>
      <PageHero
        title="Country Profiles"
  
      />

      <div className={`container ${styles.wrap}`}>

        {/* Intro */}
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
            Various countries are at different stages of elaborating these
            long-term sustainability roadmaps.{" "}
            <strong>
              With support from UNAIDS and partners, more than 30 countries have
              shown great leadership to develop nationally owned roadmaps.
            </strong>{" "}
            These include Benin, Botswana, Eswatini, Ghana, Kenya, Lesotho,
            Malawi, Namibia, Tanzania and Zanzibar, Togo, and Zambia.
          </p>
        </div>

        {/* Search */}
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              placeholder="Search countries…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenRegion(null); setOpenCountry(null); }}
              aria-label="Search countries"
            />
          </div>
          {openRegion && (
            <button className={styles.backBtn} onClick={() => { setOpenRegion(null); setOpenCountry(null); }}>
              ← All regions
            </button>
          )}
        </div>

        {/* Loading */}
        {regions === null && <p className={styles.state}>Loading regions…</p>}
        {regions !== null && filtered.length === 0 && (
          <p className={styles.state}>
            {query ? `No countries match "${query}".` : "Regions will appear here once added from the admin."}
          </p>
        )}

        {/* ── View 1: Region cards grid ─────────────────────────────────── */}
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
                  <GlobeIcon />
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

        {/* ── View 2: Open region → country list ───────────────────────── */}
        {openRegion && currentRegion && (
          <div className={styles.regionDetail}>
            <div className={styles.regionDetailHeader}>
              <div className={styles.regionDetailIcon}><GlobeIcon /></div>
              <div>
                <h2 className={styles.regionDetailName}>{currentRegion.name}</h2>
                <span className={styles.regionDetailCount}>
                  {(currentRegion.countries || []).length} countries
                </span>
              </div>
            </div>

            <div className={styles.countryGrid}>
              {(currentRegion.countries || []).map((c) => (
                <button
                  key={c.slug}
                  className={`${styles.countryCard} ${openCountry === c.slug ? styles.countryCardActive : ""}`}
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

            {/* ── View 3: Country documents panel ───────────────────────── */}
            {openCountry && (
              <div className={styles.documentsPanel}>
                {loadingCountry && !currentCountry && (
                  <p className={styles.state}>Loading documents…</p>
                )}

                {!loadingCountry && currentCountry && (
                  <>
                    <div className={styles.documentsPanelHeader}>
                      {currentCountry.flag_url && (
                        <img src={currentCountry.flag_url} alt="" className={styles.docPanelFlag} />
                      )}
                      <h3 className={styles.documentsPanelTitle}>
                        {currentCountry.name}
                      </h3>
                    </div>

                    {currentCountry.summary && (
                      <div
                        className={styles.countrySummary}
                        dangerouslySetInnerHTML={{ __html: currentCountry.summary }}
                      />
                    )}

                    {(currentCountry.documents || []).length === 0 ? (
                      <p className={styles.emptyDocs}>
                        No documents published for this country yet.
                      </p>
                    ) : (
                      <div className={styles.docsGrid}>
                        {currentCountry.documents.map((doc) => (
                          <DocumentCard key={doc.id} doc={doc} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!loadingCountry && currentCountry === null && (
                  <p className={styles.state}>Could not load this country profile.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon({ down }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ transform: down ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 220ms ease" }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
