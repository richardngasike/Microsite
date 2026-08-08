"use client";

import { useEffect, useState } from "react";
import { getRegions } from "@/lib/api";
import styles from "./CountrySelect.module.css";

// Regions and their countries are managed entirely from the Django admin.
// This dropdown groups countries under their region using <optgroup>.
// Uses window.location.href instead of router.push because Next.js static
// export does not pre-build dynamic /country-profiles/[slug] pages — a hard
// navigation lets the browser load whatever shell is available and the
// country-profiles page handles the inline drill-down instead.
export default function CountrySelect() {
  const [regions, setRegions] = useState([]);
  const [value, setValue]     = useState("");

  useEffect(() => {
    getRegions().then((data) => setRegions(Array.isArray(data) ? data : []));
  }, []);

  const handleOpen = () => {
    // Navigate to the country profiles listing page with the country slug as a
    // query param so the page can auto-open the correct region + country panel.
    if (value) {
      window.location.href = `/country-profiles/?country=${value}`;
    }
  };

  const hasData = regions.some((r) => (r.countries || []).length > 0);

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="country-select">
        Select a country
      </label>
      <div className={styles.row}>
        <div className={styles.selectWrap}>
          <select
            id="country-select"
            className={styles.select}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">
              {hasData ? "Choose a country…" : "No countries published yet"}
            </option>
            {regions.map((region) => (
              <optgroup key={region.slug || region.name} label={region.name}>
                {(region.countries || []).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <Chevron />
        </div>
        <button
          className={styles.btn}
          onClick={handleOpen}
          disabled={!value}
        >
          View profile
        </button>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg className={styles.chevron} width="20" height="20" viewBox="0 0 24 24"
      fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}