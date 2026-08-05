"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/api";
import styles from "./news.module.css";

export default function NewsPage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getNews().then((d) => setPosts(Array.isArray(d) ? d : []));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="News & stories"
        title="From the sustainability initiative"
        lead="Announcements, stories and updates on the sustainability of the HIV response."
      />
      <div className="container" style={{ padding: "56px 24px 40px" }}>
        {posts === null && <p className={styles.state}>Loading…</p>}
        {posts !== null && posts.length === 0 && (
          <p className={styles.state}>
            News articles will appear here once published from the admin.
          </p>
        )}
        {posts && posts.length > 0 && (
          <div className={styles.grid}>
            {posts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
