import styles from "./PageHero.module.css";

// Compact banner for interior pages. Keeps a consistent brand frame without
// repeating the homepage slider.
export default function PageHero({ eyebrow, title, lead }) {
  return (
    <section className={styles.hero}>
      <div className="container">
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </section>
  );
}
