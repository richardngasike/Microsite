"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { search } from "@/lib/api";
import styles from "./SearchOverlay.module.css";

// Full-screen search that queries the Django /search endpoint. Debounced,
// keyboard-accessible, closes on Escape or backdrop click.
export default function SearchOverlay({ onClose }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const runSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      setTouched(false);
      return;
    }
    setLoading(true);
    setTouched(true);
    const data = await search(term.trim());
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(q), 260);
    return () => clearTimeout(debounceRef.current);
  }, [q, runSearch]);

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.searchRow}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder="Search documents, news, countries, guidance…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search query"
          />
          <button className={styles.close} onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </div>

        <div className={styles.results}>
          {loading && <p className={styles.status}>Searching…</p>}

          {!loading && touched && results.length === 0 && (
            <p className={styles.status}>
              No results for “{q}”. Try a different term.
            </p>
          )}

          {!loading &&
            results.map((r) => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.url}
                className={styles.result}
                onClick={onClose}
              >
                <span className={styles.resultType}>{r.type}</span>
                <span className={styles.resultTitle}>{r.title}</span>
                {r.excerpt && (
                  <span className={styles.resultExcerpt}>{r.excerpt}</span>
                )}
              </Link>
            ))}

          {!touched && (
            <p className={styles.hint}>
              Find technical guidance, country profiles, GC8 documents, news and
              resources across the site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
