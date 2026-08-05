import Link from "next/link";
import styles from "./Section.module.css";

// Consistent section framing: eyebrow, heading, optional lead + "view all".
export default function Section({
  eyebrow,
  title,
  lead,
  viewAllHref,
  viewAllLabel = "View all",
  children,
  tone = "light",
}) {
  return (
    <section className={`${styles.section} ${tone === "muted" ? styles.muted : ""}`}>
      <div className="container">
        {(eyebrow || title || viewAllHref) && (
          <header className={styles.head}>
            <div>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              {title && <h2 className={styles.title}>{title}</h2>}
              {lead && <p className={styles.lead}>{lead}</p>}
            </div>
            {viewAllHref && (
              <Link href={viewAllHref} className={styles.viewAll}>
                {viewAllLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
