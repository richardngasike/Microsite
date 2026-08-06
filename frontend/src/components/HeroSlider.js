"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

// Slides use real UNAIDS sustainability messaging. Background images are
const SLIDES = [
  {
    id: "approach",
    eyebrow: "Sustainability Approach",
    title: "New HIV Response",
    body: "A new approach to ensure the sustainability of the HIV response — holistic, country-led, and built across five sustainability domains.",
    image: "/images/hero1.jpg",
    primary: { label: "About the approach", href: "/about" },
    secondary: { label: "How it works", href: "/technical-guidance" },
  },
  {
    id: "roadmaps",
    eyebrow: "Country-led planning",
    title: "Sustainability Roadmaps",
    body: "Tools to help countries and partners develop roadmaps and navigate the path towards sustainability beyond 2030.",
    image: "/images/hero3.jpg",
    primary: { label: "Country profiles", href: "/country-profiles" },
    secondary: { label: "Technical guidance", href: "/technical-guidance" },
  },
  {
    id: "gc8",
    eyebrow: "Global Fund",
    title: "Grant Cycle 8 (GC8)",
    body: "Access GC8 documents, templates and guidance supporting sustainable HIV financing and programming.",
    image: "/images/hero2.jpg",
    primary: { label: "Explore GC8", href: "/gc8" },
    secondary: { label: "Resources", href: "/resources" },
  },
];

const INTERVAL = 6500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback(
    (next) => setIndex((prev) => (next + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, go]);

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.track}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${i === index ? styles.active : ""}`}
            aria-hidden={i !== index}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.scrim} />
            <div className={`container ${styles.content}`}>
              <span className={styles.eyebrow}>{slide.eyebrow}</span>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.body}>{slide.body}</p>
              <div className={styles.actions}>
                <Link href={slide.primary.href} className={styles.primaryBtn}>
                  {slide.primary.label}
                  <Arrow />
                </Link>
                <Link href={slide.secondary.href} className={styles.secondaryBtn}>
                  {slide.secondary.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className={`${styles.arrowBtn} ${styles.prev}`}
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
      >
        <Chevron dir="left" />
      </button>
      <button
        className={`${styles.arrowBtn} ${styles.next}`}
        onClick={() => go(index + 1)}
        aria-label="Next slide"
      >
        <Chevron dir="right" />
      </button>

      <div className={styles.dots} role="tablist" aria-label="Choose slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            aria-selected={i === index}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Chevron({ dir }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : "none" }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
