"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DocumentCard from "@/components/DocumentCard";
import { getCountry } from "@/lib/api";
import styles from "./detail.module.css";

export default function CountryDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [country, setCountry] = useState(undefined);

  useEffect(() => {
    if (!slug) return;
    getCountry(slug).then((d) => setCountry(d || null));
  }, [slug]);

  if (country === undefined)
    return <p className={styles.state}>Loading country profile…</p>;

  if (country === null)
    return (
      <div className={styles.state}>
        <p>This country profile could not be found.</p>
        <Link href="/country-profiles" className={styles.back}>
          ← All country profiles
        </Link>
      </div>
    );

  return (
    <article>
      <div className={styles.hero}>
        <div className="container">
          <Link href="/country-profiles" className={styles.crumb}>
            ← Country profiles
          </Link>
          <div className={styles.heroRow}>
            {country.flag_url && (
              <img src={country.flag_url} alt="" className={styles.flag} />
            )}
            <div>
              {country.region_name && (
                <span className={styles.region}>{country.region_name}</span>
              )}
              <h1 className={styles.title}>{country.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className={`container ${styles.wrap}`}>
        {country.summary && (
          <div className={styles.summary}>
            <div dangerouslySetInnerHTML={{ __html: country.summary }} />
          </div>
        )}

        <h2 className={styles.sectionTitle}>Country documents</h2>
        {(country.documents || []).length === 0 ? (
          <p className={styles.empty}>
            Documents for this country will appear here once published.
          </p>
        ) : (
          <div className={styles.grid}>
            {country.documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
