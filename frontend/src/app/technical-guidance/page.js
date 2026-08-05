"use client";

import { useCallback } from "react";
import PageHero from "@/components/PageHero";
import DocumentGrid from "@/components/DocumentGrid";
import { getGuidance } from "@/lib/api";

export default function TechnicalGuidancePage() {
  const fetcher = useCallback(() => getGuidance(), []);
  return (
    <>
      <PageHero
        eyebrow="Technical guidance"
        title="Develop roadmaps, navigate sustainability"
        lead="Tools to help countries and partners develop roadmaps and navigate the path towards sustainability — including the Primer, the Companion Guide, the Sustainability Assessment tool and country analytical resource packages."
      />
      <div className="container" style={{ padding: "56px 24px 40px" }}>
        <DocumentGrid
          fetcher={fetcher}
          categories={["Primer", "Companion Guide", "Assessment Tool", "User Guide"]}
          emptyText="Guidance documents will appear here once published from the admin."
        />
      </div>
    </>
  );
}
