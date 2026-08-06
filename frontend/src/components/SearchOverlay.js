"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { search } from "@/lib/api";
import styles from "./SearchOverlay.module.css";

export default function SearchOverlay({ onClose }) {
  const [q, setQ]             = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef   = useRef(null);
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
    if (!term.trim()) { setResults([]); setTouched(false); return; }
    setLoading(true);
    setTouched(true);
    const data = await search(term.trim());
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(q), 280);
    return () => clearTimeout(debounceRef.current);
  }, [q, runSearch]);

  // Determine if a result URL is internal (starts with /) or external
  const isInternal = (url) => url && url.startsWith("/");

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

        <div className={styles.results} role="list">
          {loading && (
            <div className={styles.statusRow}>
              <span className={styles.spinner} aria-label="Searching…" />
              <span className={styles.status}>Searching…</span>
            </div>
          )}

          {!loading && touched && results.length === 0 && (
            <p className={styles.status}>
              No results for "<strong>{q}</strong>". Try a different term.
            </p>
          )}

          {!loading && results.map((r, i) => (
            isInternal(r.url) ? (
              <Link
                key={`${r.type}-${r.id ?? i}`}
                href={r.url}
                className={styles.result}
                onClick={onClose}
                role="listitem"
              >
                <ResultInner r={r} />
              </Link>
            ) : (
              <a
                key={`${r.type}-${r.id ?? i}`}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className={styles.result}
                onClick={onClose}
                role="listitem"
              >
                <ResultInner r={r} />
              </a>
            )
          ))}

          {!touched && (
            <div className={styles.hint}>
              <p>Find technical guidance, country profiles, GC8 documents, news and resources.</p>
              <div className={styles.hintChips}>
                {["Sustainability", "Country profiles", "GC8", "Roadmaps"].map((term) => (
                  <button key={term} className={styles.chip} onClick={() => setQ(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultInner({ r }) {
  return (
    <>
      <span className={styles.resultType}>{r.type}</span>
      <span className={styles.resultTitle}>{r.title}</span>
      {r.excerpt && (
        <span className={styles.resultExcerpt}>{r.excerpt}</span>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}