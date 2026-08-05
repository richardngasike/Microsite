"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getRegions } from "@/lib/api";
import styles from "./countries.module.css";

export default function CountryProfilesPage() {
  const [regions, setRegions] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getRegions().then((d) => setRegions(Array.isArray(d) ? d : []));
  }, []);

  const filterCountries = (countries = []) =>
    countries.filter((c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase())
    );

  return (
    <>
      <PageHero
        title="Country Profiles"
      />

      <div className={`container ${styles.wrap}`}>

        {/* Intro paragraph */}
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
            have submitted to UNAIDS, the Global Fund and PEPFAR, as well as
            datasets specific to the Global Fund and PEPFAR and is{" "}
            <strong>
              meant to be a "conversation starter" for the Sustainability
              Dialogues, as well as to support the qualitative and quantitative
              assessments.
            </strong>{" "}
            However, the resource package is not exhaustive and may not include
            all the data and analysis that are needed for an evidence-informed
            dialogue. The vision of the new HIV response sustainability approach
            is to "galvanize efforts and to drive sustainable HIV response
            transformations to reach and maintain epidemic control beyond 2030,
            by upholding the right to health for all". Various countries are at
            different stages of elaborating these long-term sustainability
            roadmaps.{" "}
            <strong>
              With support from UNAIDS and partners, more than 30 countries have
              shown great leadership to develop nationally owned roadmaps.
            </strong>{" "}
            Several of these roadmaps have been endorsed and can be found through
            the country tabs below, or by clicking on the country. These include
            Benin, Botswana, Eswatini, Ghana, Kenya, Lesotho, Malawi, Namibia,
            Tanzania and Zanzibar, Togo, and Zambia. As more become available
            this page will act as a repository.
          </p>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search countries"
          />
        </div>

        {regions === null && <p className={styles.state}>Loading countries…</p>}
        {regions !== null && regions.length === 0 && (
          <p className={styles.state}>
            Regions and countries will appear here once added from the admin.
          </p>
        )}

        {regions &&
          regions.map((region) => {
            const countries = filterCountries(region.countries);
            if (countries.length === 0) return null;
            return (
              <section key={region.slug || region.name} className={styles.region}>
                <h2 className={styles.regionTitle}>{region.name}</h2>
                <div className={styles.grid}>
                  {countries.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/country-profiles/${c.slug}`}
                      className={styles.country}
                    >
                      {c.flag_url && <img src={c.flag_url} alt="" className={styles.flag} />}
                      <span>{c.name}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
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