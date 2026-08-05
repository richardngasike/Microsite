"use client";

import { trackDownload } from "@/lib/api";
import styles from "./DocumentCard.module.css";

// A single downloadable resource. Thumbnail + file-type badge come from the
// backend (Supabase-stored file and generated thumbnail). Clicking records a
// download event so the admin analytics dashboard can count it.
export default function DocumentCard({ doc }) {
  const {
    id,
    title,
    description,
    file_type = "PDF",
    file_url,
    thumbnail_url,
    download_count,
    published_date,
  } = doc;

  const handleOpen = () => {
    // Fire-and-forget analytics; never blocks the download.
    if (id) trackDownload(id);
  };

  return (
    <article className={styles.card}>
      <a
        href={file_url || "#"}
        target="_blank"
        rel="noreferrer"
        onClick={handleOpen}
        className={styles.thumbLink}
        aria-label={`Open ${title}`}
      >
        <div className={styles.thumb}>
          {thumbnail_url ? (
            <img src={thumbnail_url} alt="" loading="lazy" />
          ) : (
            <div className={styles.thumbFallback}>
              <FileIcon />
            </div>
          )}
          <span className={styles.badge}>{String(file_type).toUpperCase()}</span>
        </div>
      </a>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}

        <div className={styles.meta}>
          {published_date && <span>{formatDate(published_date)}</span>}
          {typeof download_count === "number" && (
            <span className={styles.downloads}>
              <DownloadIcon /> {download_count.toLocaleString()}
            </span>
          )}
        </div>

        <a
          href={file_url || "#"}
          target="_blank"
          rel="noreferrer"
          onClick={handleOpen}
          className={styles.action}
        >
          Download
          <DownloadIcon />
        </a>
      </div>
    </article>
  );
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function FileIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
