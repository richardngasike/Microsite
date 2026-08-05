"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { getFaqs } from "@/lib/api";
import styles from "./faqs.module.css";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getFaqs().then((d) => setFaqs(Array.isArray(d) ? d : []));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        lead="Answers to questions received from UNAIDS country officers, national counterparts and partners on the sustainability approach and roadmaps."
      />
      <div className={`container ${styles.wrap}`}>
        {faqs === null && <p className={styles.state}>Loading…</p>}
        {faqs !== null && faqs.length === 0 && (
          <p className={styles.state}>
            FAQs will appear here once published from the admin.
          </p>
        )}
        {faqs && faqs.map((f, i) => (
          <div key={f.id} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{f.question}</span>
              <span className={`${styles.icon} ${open === i ? styles.iconOpen : ""}`}>+</span>
            </button>
            <div className={`${styles.answer} ${open === i ? styles.answerOpen : ""}`}>
              <div dangerouslySetInnerHTML={{ __html: f.answer || "" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
