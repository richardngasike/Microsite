"use client";

import { useCallback } from "react";
import PageHero from "@/components/PageHero";
import DocumentGrid from "@/components/DocumentGrid";
import { getRoadmaps } from "@/lib/api";
import styles from "./roadmaps.module.css";

export default function SustainabilityRoadmapsPage() {
  const fetcher = useCallback(() => getRoadmaps(), []);

  return (
    <>
      <PageHero
        title="Sustainability Roadmaps"
      />

      <div className={`container ${styles.wrap}`}>

        {/* Intro paragraph */}
        <div className={styles.intro}>
          <p>
            The country document page includes{" "}
            <strong>
              country profiles, which are an analytical resource package useful
              when considering the country's sustainability landscape.
            </strong>{" "}
            Additionally, this page hosts{" "}
            <strong>
              finalized country-specific sustainability roadmaps, "part A" –
              synthesis roadmap and "part B" – transformation plan.
            </strong>{" "}
            The analytical resource package draws on datasets which countries
            have submitted to UNAIDS, the Global Fund and PEPFAR, as well as
            datasets specific to the Global Fund and PEPFAR and is{" "}
            <strong>
              meant to be a "conversation starter" for the Sustainability
              Dialogues, as well as to support the qualitative and quantitative
              assessments.
            </strong>{" "}
            However, the resource package is not exhaustive and may not include
            all the data and analysis that are needed for an evidence-informed
            dialogue. The vision of the new HIV response sustainability approach
            is to "galvanize efforts and to drive sustainable HIV response
            transformations to reach and maintain epidemic control beyond 2030,
            by upholding the right to health for all". Various countries are at
            different stages of elaborating these long-term sustainability
            roadmaps.{" "}
            <strong>
              With support from UNAIDS and partners, more than 30 countries have
              shown great leadership to develop nationally owned roadmaps.
            </strong>{" "}
            Several of these roadmaps have been endorsed and can be found through
            the country tabs below, or by clicking on the country. These include
            Benin, Botswana, Eswatini, Ghana, Kenya, Lesotho, Malawi, Namibia,
            Tanzania and Zanzibar, Togo, and Zambia. As more become available
            this page will act as a repository.
          </p>
        </div>

        <DocumentGrid
          fetcher={fetcher}
          categories={["Roadmap", "Summary", "Briefing", "Template"]}
          emptyText="Country roadmaps will appear here once published from the admin."
        />
      </div>
    </>
  );
}