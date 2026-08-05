import Link from "next/link";
import { SITE, FOOTER_UTILITY } from "@/lib/site";
import styles from "./Footer.module.css";

// Deliberately minimal. It carries the wordmark, a one-line mission statement,
// and utility/legal links only — none of the header's section navigation is
// repeated here.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img
            src="/images/unaids white logo.png"
            alt="UNAIDS"
            className={styles.logo}
          />
          <p className={styles.mission}>{SITE.tagline}</p>
        </div>

        <nav className={styles.utility} aria-label="Legal and utility">
          {FOOTER_UTILITY.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            )
          )}
        </nav>
      </div>

      <div className={styles.baseline}>
        <div className={`container ${styles.baselineInner}`}>
          <span>© {SITE.year} {SITE.org}. All rights reserved.</span>
          <span className={styles.subtle}>
            Joint United Nations Programme on HIV/AIDS
          </span>
        </div>
      </div>
    </footer>
  );
}
