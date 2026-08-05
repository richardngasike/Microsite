"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentCard from "./DocumentCard";
import styles from "./DocumentGrid.module.css";

// Generic grid with a text filter and optional category chips. `fetcher` is any
// api function returning a list of documents. Used across multiple pages so the
// document-listing UI is written once.
export default function DocumentGrid({ fetcher, categories = [], emptyText }) {
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  useEffect(() => {
    let mounted = true;
    fetcher().then((data) => {
      if (mounted) setItems(Array.isArray(data) ? data : []);
    });
    return () => { mounted = false; };
  }, [fetcher]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((d) => {
      const matchesCat = active === "all" || d.category === active;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        d.title?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [items, query, active]);

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Filter documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter documents"
          />
        </div>
        {categories.length > 0 && (
          <div className={styles.chips}>
            <button
              className={`${styles.chip} ${active === "all" ? styles.chipActive : ""}`}
              onClick={() => setActive("all")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`${styles.chip} ${active === c ? styles.chipActive : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {items === null && <p className={styles.state}>Loading documents…</p>}

      {items !== null && filtered.length === 0 && (
        <p className={styles.state}>
          {emptyText || "No documents match your filter yet."}
        </p>
      )}

      {filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
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
