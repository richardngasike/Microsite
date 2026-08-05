"use client";

import { useCallback } from "react";
import PageHero from "@/components/PageHero";
import DocumentGrid from "@/components/DocumentGrid";
import { getResources } from "@/lib/api";

export default function ResourcesPage() {
  const fetcher = useCallback(() => getResources(), []);
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="News, publications & infographics"
        lead="A collection of news, stories, video, publications and infographics related to the sustainability of the HIV response."
      />
      <div className="container" style={{ padding: "56px 24px 40px" }}>
        <DocumentGrid
          fetcher={fetcher}
          categories={["Publication", "Infographic", "Video", "Report", "Story"]}
          emptyText="Resources will appear here once published from the admin."
        />
      </div>
    </>
  );
}
