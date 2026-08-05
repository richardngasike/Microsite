"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import styles from "./about.module.css";



export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="The New Sustainability Approach"
        lead="UNAIDS has proposed a new approach to ensure the sustainability of the HIV response — holistic, country-led, and built across five domains."
      />


      {/* ── Main content ────────────────────────────────────────────────── */}
      <article className={styles.page}>
        <div className="container">

          {/* Block 1 — intro + tall portrait image */}
          <div className={styles.block1}>
            <div className={styles.block1Text}>
              <p className={styles.lead}>
                <strong>
                  UNAIDS has proposed a new approach to ensure the
                  sustainability of the HIV response.
                </strong>{" "}
                This holistic approach cuts across five sustainability domains,
                including political leadership and commitment, enabling laws and
                policies, sustainable and equitable financing, science-driven,
                effective and high-impact HIV services and solutions, and systems
                built to deliver.
              </p>

              <p>
                UNAIDS believes that the moment is right for the global HIV
                community to actively{" "}
                <strong>
                  begin planning for a sustained HIV response beyond 2030
                </strong>
                . The goal of the new sustainability approach is to use a
                transformative lens, articulating the shifts needed for the
                long-term sustainability and lasting impact of the HIV response.
                Understanding that sustainability will require different measures
                and approaches in diverse settings, it is important that
                countries tailor their response planning and implementation to
                their specific contexts.{" "}
                <strong>
                  Therefore, the new approach calls for a country driven and
                  owned processes that leverage country data and information,
                  that will chart the pathways for country level strategies and
                  actions to achieve and sustain impact and leave no one behind.
                </strong>
              </p>
            </div>

            <div className={styles.block1Image}>
              <img
                src="/images/Esnart_Mucheleka.jpg"
                alt="Community health worker speaking with a patient"
                loading="lazy"
              />
            </div>
          </div>

          {/* Block 2 — wide paragraph */}
          <div className={styles.block2}>
            <p>
              The process for developing the HIV Response Sustainability Roadmaps
              is aligned with the principles, goals and targets set out in the{" "}
              <strong>Global AIDS Strategy 2021–2026</strong> and in the 2021
              Political Declaration on Ending AIDS, therefore countries should
              prioritize the strategies and actions most urgently needed to
              achieve the 2025 targets and end AIDS by 2030. To support these
              actions, sustainability will be at the top of UNAIDS priority
              agenda in 2024. Together with its co-sponsors, partners such as
              PEPFAR and the Global Fund, and other stakeholders of the Global
              HIV community, UNAIDS is resolute in its commitment to supporting
              countries leverage the tools and analytics, the lessons learned,
              the science of what works where, to foster open and honest dialogue
              on the future of the HIV response, the{" "}
              <strong>
                transformations needed to ensure that responses across the globe
                are not in danger of putting millions of lives and livelihoods at
                risk and the financing commitments needed for scale and impact.
              </strong>
            </p>
          </div>

          {/* Block 3 — image mosaic grid */}
          <div className={styles.imageGrid}>
            <div className={styles.imageGridWide}>
              <img
                src="/images/UNAIDS Tanzania-28.jpg"
                alt="HIV response programme in action"
                loading="lazy"
              />
            </div>
            <div className={styles.imageGridWide}>
              <img
                src="/images/_TF20892.jpg"
                alt="Family"
                loading="lazy"
              />
            </div>
            <div className={styles.imageGridTall}>
              <img
                src="/images/UNAIDS Zimbabwe_Cynthia R Matonhodze_042.jpg"
                alt="Healthcare workers collaborating"
                loading="lazy"
              />
            </div>
          </div>

          {/* Partners strip */}
          <div className={styles.partners}>
            <span className={styles.partnersLabel}>Partners</span>
            <div className={styles.partnersRow}>
              <a
                href="https://www.state.gov/pepfar/"
                target="_blank"
                rel="noreferrer"
                className={styles.partnerCard}
              >
                <img
                  src="/images/Pepfar.png"
                  alt="PEPFAR"
                  className={styles.partnerLogo}
                />
                <span className={styles.partnerName}>PEPFAR</span>
              </a>
              <a
                href="https://www.theglobalfund.org/"
                target="_blank"
                rel="noreferrer"
                className={styles.partnerCard}
              >
                <img
                  src="/images/GlobalFund.png"
                  alt="Global Fund"
                  className={styles.partnerLogo}
                />
                <span className={styles.partnerName}>Global Fund</span>
              </a>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}