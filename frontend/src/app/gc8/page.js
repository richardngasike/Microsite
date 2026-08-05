"use client";

import { useCallback } from "react";
import PageHero from "@/components/PageHero";
import DocumentGrid from "@/components/DocumentGrid";
import { getGC8 } from "@/lib/api";

export default function GC8Page() {
  const fetcher = useCallback(() => getGC8(), []);
  return (
    <>
      <PageHero
        eyebrow="Global Fund"
        title="GC8 — Global Fund Grant Cycle 8"
        lead="Aims to support countries in their efforts to combat HIV, TB, and Malaria while strengthening resilient and Sustainable health systems."
      />
      <div className="container" style={{ padding: "56px 24px 40px" }}>
        <DocumentGrid
          fetcher={fetcher}
          categories={["Guidance", "Template", "Application", "Briefing"]}
          emptyText="GC8 documents will appear here once published from the admin."
        />
      </div>
    </>
  );
}
