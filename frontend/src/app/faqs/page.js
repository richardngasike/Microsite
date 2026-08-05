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
        lead="As countries work to develop roadmaps and navigate the path towards sustainability using the new approach to ensure the sustainability of the HIV response UNAIDS continues to seek key moments and opportunities to support countries, communities and other stakeholders in conducting HIV response sustainability dialogues and shaping HIV sustainability roadmaps and ensuring that stakeholders are well equipped for the in-country work.

The overarching objective of this section is to provides answers to questions that have been received from UNAIDS country officers, national counterparts, staff of our co-sponsor agencies and partners (including PEPFAR and Global Fund), as well as from participants on the multiple internal and public webinars that UNAIDS has convened."
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
