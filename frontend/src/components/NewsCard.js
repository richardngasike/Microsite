import Link from "next/link";
import styles from "./NewsCard.module.css";

// Blog / News item. The admin can add title, image, description, external
// link, and body — all rendered here.
export default function NewsCard({ post }) {
  const { slug, title, excerpt, image_url, category, published_date, external_url } = post;
  const href = external_url || `/news/${slug}`;
  const isExternal = Boolean(external_url);

  const Wrapper = ({ children }) =>
    isExternal ? (
      <a href={href} target="_blank" rel="noreferrer" className={styles.card}>
        {children}
      </a>
    ) : (
      <Link href={href} className={styles.card}>
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <div className={styles.media}>
        {image_url ? (
          <img src={image_url} alt="" loading="lazy" />
        ) : (
          <div className={styles.mediaFallback} />
        )}
        {category && <span className={styles.category}>{category}</span>}
      </div>
      <div className={styles.body}>
        {published_date && (
          <time className={styles.date}>{formatDate(published_date)}</time>
        )}
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        <span className={styles.readMore}>
          {isExternal ? "Read on source" : "Read more"}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Wrapper>
  );
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return d; }
}
