"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/api";
import styles from "./detail.module.css";

export default function PostDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!slug) return;
    getPost(slug).then((d) => setPost(d || null));
  }, [slug]);

  if (post === undefined) {
    return <p className={styles.state}>Loading article…</p>;
  }

  if (post === null) {
    return (
      <div className={styles.state}>
        <p>This article could not be found.</p>
        <Link href="/news" className={styles.back}>← Back to news</Link>
      </div>
    );
  }

  return (
    <article>
      <div className={styles.hero}>
        <div className="container">
          <Link href="/news" className={styles.crumb}>← News</Link>
          {post.category && <span className={styles.category}>{post.category}</span>}
          <h1 className={styles.title}>{post.title}</h1>
          {post.published_date && (
            <time className={styles.date}>{formatDate(post.published_date)}</time>
          )}
        </div>
      </div>

      {post.image_url && (
        <div className="container">
          <img className={styles.cover} src={post.image_url} alt="" />
        </div>
      )}

      <div className={`container ${styles.bodyWrap}`}>
        {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}
        {/* Body is admin-authored rich text/HTML from the backend. */}
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: post.body || "" }}
        />
        {post.external_url && (
          <a
            href={post.external_url}
            target="_blank"
            rel="noreferrer"
            className={styles.sourceBtn}
          >
            View original source
          </a>
        )}
      </div>
    </article>
  );
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return d; }
}
