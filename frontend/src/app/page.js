"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import DocumentCard from "@/components/DocumentCard";
import NewsCard from "@/components/NewsCard";
import CountrySelect from "@/components/CountrySelect";
import { DOMAINS } from "@/lib/site";
import { getResources, getNews } from "@/lib/api";
import styles from "./page.module.css";

export default function HomePage() {
  const [resources, setResources] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    getResources("?featured=true&limit=3").then((d) => setResources(d.slice(0, 3)));
    getNews("?limit=3").then((d) => setNews(d.slice(0, 3)));
  }, []);

  return (
    <>
      <HeroSlider />

      

      {/* ── FIVE DOMAINS ───────────────────────────────────────────────── */}
      <section className={styles.domainsSection}>
        <div className="container">
          <div className={styles.domainsMeta}>
            <span className={styles.sectionEyebrow}>Sustainability framework</span>
            <h2 className={styles.sectionTitle}>Five domains of sustainability</h2>
          </div>
          <div className={styles.domainsRow}>
            {DOMAINS.map((d) => (
              <article key={d.key} className={styles.domainCard}>
                <span className={styles.domainNo}>{d.number}</span>
                <h3 className={styles.domainTitle}>{d.title}</h3>
                <div className={styles.domainRule} />
                <p className={styles.domainSummary}>{d.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE MOSAIC ─────────────────────────────────────────────── */}
      <section className={styles.mosaic}>
        {/* Large lead tile */}
        <Link href="/about" className={`${styles.tile} ${styles.tileLead}`}>
          <img src="/images/Eveline Simaloy_7757.png" alt="" className={styles.tileImg} />
          <div className={styles.tileScrim} />
          <div className={styles.tileBody}>
            <span className={styles.tileEyebrow}>Initiative</span>
            <h2 className={styles.tileTitle}>New HIV Response Sustainability Approach</h2>
          </div>
        </Link>

        {/* Right grid — 2 × 2 */}
        <div className={styles.mosaicGrid}>
          <Link href="/sustainability-roadmaps" className={styles.tile}>
            <img src="/images/Lorraine Mashishi_5948.jpg" alt="" className={styles.tileImg} />
            <div className={styles.tileScrim} />
            <div className={styles.tileBody}>
              <span className={styles.tileEyebrow}>Planning</span>
              <h3 className={styles.tileSub}>Sustainability Roadmaps</h3>
            </div>
          </Link>

          <Link href="/gc8" className={styles.tile}>
            <img src="/images/GC8.jpg" alt="" className={styles.tileImg} />
            <div className={styles.tileScrim} />
            <div className={styles.tileBody}>
              <span className={styles.tileEyebrow}>Global Fund</span>
              <h3 className={styles.tileSub}>Grant Cycle 8 (GC8)</h3>
            </div>
          </Link>

          <Link href="/country-profiles" className={styles.tile}>
            <img src="/images/UN063429.jpg" alt="" className={styles.tileImg} />
            <div className={styles.tileScrim} />
            <div className={styles.tileBody}>
              <span className={styles.tileEyebrow}>Data & analysis</span>
              <h3 className={styles.tileSub}>Country Profiles</h3>
            </div>
          </Link>

          <Link href="/technical-guidance" className={styles.tile}>
            <img src="/images/DSC_0167.jpg" alt="" className={styles.tileImg} />
            <div className={styles.tileScrim} />
            <div className={styles.tileBody}>
              <span className={styles.tileEyebrow}>Tools</span>
              <h3 className={styles.tileSub}>Technical Guidance</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FEATURED RESOURCES ─────────────────────────────────────────── */}
      <section className={styles.resourcesSection}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionEyebrow}>Technical guidance</span>
              <h2 className={styles.sectionTitle}>Tools to build sustainability roadmaps</h2>
            </div>
            <Link href="/technical-guidance" className={styles.viewAll}>
              View all <ArrowIcon />
            </Link>
          </div>

          {resources.length > 0 ? (
            <div className={styles.resourceGrid}>
              {resources.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📄</span>
              <p>Guidance documents will appear here once published.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── COUNTRY PROFILES ───────────────────────────────────────────── */}
      <section className={styles.countrySection}>
        <div className="container">
          <div className={styles.countryInner}>
            <div className={styles.countryText}>
              <span className={styles.sectionEyebrowLight}>Country profiles</span>
              <h2 className={styles.sectionTitleLight}>Explore the country landscape</h2>
              <p className={styles.countryLead}>
                Data and qualitative information on each country's sustainability
                landscape, organised by region.
              </p>
            </div>
            <div className={styles.countryWidget}>
              <CountrySelect />
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ───────────────────────────────────────────────────────── */}
      <section className={styles.newsSection}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionEyebrow}>News & stories</span>
              <h2 className={styles.sectionTitle}>Latest from the initiative</h2>
            </div>
            <Link href="/news" className={styles.viewAll}>
              View all <ArrowIcon />
            </Link>
          </div>

          {news.length > 0 ? (
            <div className={styles.newsGrid}>
              {news.map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📰</span>
              <p>News will appear here once published.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT STRIP ──────────────────────────────────────────────── */}
      <section className={styles.contactStrip}>
        <div className={`container ${styles.contactInner}`}>
          <div className={styles.contactText}>
            <h2 className={styles.contactTitle}>Have a question?</h2>
            <p className={styles.contactBody}>
              Get in touch about the initiative, the process, or how to develop a
              country roadmap.
            </p>
          </div>
          <Link href="/contact" className={styles.contactBtn}>
            Contact us <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}