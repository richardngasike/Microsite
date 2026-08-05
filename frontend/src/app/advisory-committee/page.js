"use client";

import { useEffect, useState, useMemo } from "react";
import PageHero from "@/components/PageHero";
import { getAdvisoryMembers } from "@/lib/api";
import styles from "./advisory-committee.module.css";

// Group order matches the real page structure exactly.
const GROUP_ORDER = [
  "secretariat",
  "cochair",
  "government",
  "communities",
  "independent",
  "regional",
  "development",
];

const GROUP_LABELS = {
  secretariat: "Advisory Committee Secretariat",
  cochair: "Co-Chairs",
  government: "Members – Government Representatives",
  communities: "Members – Communities",
  independent: "Members – Independent Experts",
  regional: "Members – Regional Entities",
  development: "Members – Development Partners",
};

export default function AdvisoryCommitteePage() {
  const [members, setMembers] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getAdvisoryMembers().then((d) => setMembers(Array.isArray(d) ? d : []));
  }, []);

  // Group members by their group key, preserving order defined above.
  const grouped = useMemo(() => {
    if (!members) return {};
    return members.reduce((acc, m) => {
      acc[m.group] = acc[m.group] || [];
      acc[m.group].push(m);
      return acc;
    }, {});
  }, [members]);

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <PageHero
        eyebrow="Advisory Committee"
        title="Advisory Committee on Sustainability of the HIV Response"
        lead="A multi-sectoral body that protects country ownership and leadership while providing guidance, consistency and oversight to the multi-country process."
      />

      {/* ── Terms of Reference ──────────────────────────────────────────── */}
      <section className={styles.tor}>
        <div className="container">
          <div className={styles.torTabs}>
            <span className={styles.torTab}>Terms of reference</span>
            <span className={styles.torTabDivider} />
            <span className={styles.torTabMuted}>Members</span>
          </div>

          <div className={styles.torBody}>
            <p>
              Two years after the adoption of an ambitious, but achievable
              Political Declaration on HIV and AIDS: Ending Inequalities and
              Getting on Track to End AIDS by 2030 and the setting of ambitious
              interim targets for 2025 that the world would need to achieve if we
              are to reach the 2030 HIV targets within the Sustainable
              Development Goals, many countries are demonstrating that these
              targets can be achieved. While progress is widespread, it remains
              uneven. 2024 must be a year of deep and critical reflection on how
              to ensure a resilient long‐term HIV response that ensures impact
              through continued and sustained reduction in new HIV infections and
              HIV‐related deaths and mitigates the risks of resurgence.
            </p>
            <p>
              This is a pivotal moment in the global HIV response. It is
              therefore a unique opportunity to articulate the pathway to success
              in the HIV response to 2030 and start looking beyond. UNAIDS in
              close collaboration with its partners have joined efforts towards a
              new sustainability framework. Under the leadership of governments
              with their plans, UNAIDS will coordinate efforts to hold HIV
              response sustainability dialogues and assessments, leading to
              prepare synthesis sustainability roadmaps by end 2024.
            </p>
            <p>
              To provide oversight and ensure a reflective iterative learning
              across geographies, we are standing up a UNAIDS Advisory Committee
              (AC) on Sustainability of the HIV Response. The Committee is
              expected to be a multi-sectorial body that protects country
              ownership and leadership while providing guidance, consistency and
              oversight to the multi-country process, inclusive of sustainability
              dialogues, assessments and roadmap implementation as needed. The AC
              will not oversee individual country HIV response roadmaps.
            </p>
          </div>

          {/* Function */}
          <div className={styles.torBlock}>
            <h2 className={styles.torHeading}>The Advisory Committee function</h2>
            <p className={styles.torLead}>
              The AC members will provide independent non-binding advice on the
              overall design and approach to HIV Response Sustainability
              Dialogues, assessments and Roadmaps and implementation, including
              providing feedback and suggestions regarding:
            </p>
            <ul className={styles.torList}>
              <li>Flexible approaches and methods being designed, proposed and adapted;</li>
              <li>Priority actions to secure country ownership;</li>
              <li>Steps in generating and maintaining political momentum, country ownership, and donor alignment, towards delivery and accountability;</li>
              <li>Take stock of progress, analyze challenges and potential solutions to implementation;</li>
              <li>Promoting effective examples, fostering cross-learning and South to South collaboration.</li>
            </ul>
            <p className={styles.torNote}>
              The AC members will not be expected to review individual country
              HIV response sustainability roadmaps.
            </p>
          </div>

          {/* Composition */}
          <div className={styles.torBlock}>
            <h2 className={styles.torHeading}>The Advisory Committee Composition</h2>
            <p>
              The Committee will be co-chaired by two high level personalities,
              noted for their contributions to the HIV response and will be
              supported by a hands-on Secretariat to ensure its functioning,
              preparatory works and translation of discussions into action.
            </p>
            <p>
              The Committee will include in its membership a range of
              stakeholders working in HIV epidemiology, AIDS response
              programmatic components, HIV, health and social sector financing,
              human rights, and community response, as well as representatives of
              UNAIDS Cosponsors, the Global Fund, PEPFAR, civil society, people
              living with HIV, key, and vulnerable populations. Committee
              membership is nominative, and members are institutionally
              independent from UNAIDS. The proposed membership is as follows:
            </p>
            <ul className={styles.torList}>
              <li>2 Co-chairs: one Government representative and one independent expert/thought leader</li>
              <li>3 UNAIDS Cosponsors representatives</li>
              <li>6 Representatives of PLHIV, civil society and key population</li>
              <li>3 Representatives of Regional entities</li>
              <li>2 independent experts</li>
              <li>4–5 Government representatives, bringing views from their respective regions</li>
            </ul>
            <p className={styles.torNote}>
              Advisory committee membership is nominative, and members are
              institutionally independent from UNAIDS.
            </p>
          </div>

          {/* Secretariat TOR */}
          <div className={styles.torBlock}>
            <h2 className={styles.torHeading}>Advisory Committee Secretariat</h2>
            <p>
              The Advisory Committee will be supported by a hands-on Secretariat
              to guide the process for developing country-led{" "}
              <em>Sustainability Roadmaps for the HIV Response</em>, with UNAIDS
              Secretariat, PEPFAR, the Global Fund and open to other members to
              join.
            </p>
            <ul className={styles.torList}>
              <li>The Secretariat will provide coordination and administration support to the Committee including proposing the agenda, preparing the background materials, and organizing the meetings.</li>
              <li>The Secretariat will be responsible for minutes of the proceedings and documenting the recommendations of the Committee, and if needed, carrying forward the implementation of actions that may follow the works and deliberations of the Committee.</li>
              <li>The Secretariat will act as the liaison between the Committee and the Taskforce and Working Groups set up to support the development of sustainability dialogues and roadmaps.</li>
              <li>The Secretariat may be requested, on behalf of the Committee, to seek contributions from other groups or stakeholders that may be considered relevant to consult or involve in the work around HIV sustainability.</li>
              <li>The Secretariat will propose to the Committee a Working Group to handle the governance of the HIV sustainability initiative if / as considered necessary.</li>
            </ul>
          </div>

          <p className={styles.torFootnote}>
            Members will be appointed to serve for an 18 months-time period from
            January 2024 to June 2025. The Committee is expected to meet
            face-to-face twice during this period and virtually quarterly for
            regular status updates. The members will participate on a pro-bono
            basis; however, the cost of travel and per diem to participate in
            face-to-face meetings will be covered.
          </p>
        </div>
      </section>

      {/* ── Members ─────────────────────────────────────────────────────── */}
      <section className={styles.membersSection}>
        <div className="container">
          <h2 className={styles.membersHeading}>
            Members of the Advisory Committee
          </h2>

          {members === null && (
            <p className={styles.state}>Loading members…</p>
          )}

          {members !== null && members.length === 0 && (
            <p className={styles.state}>
              Committee members will appear here once added from the admin.
            </p>
          )}

          {GROUP_ORDER.map((group) => {
            const list = grouped[group];
            if (!list || list.length === 0) return null;
            return (
              <div key={group} className={styles.group}>
                <h3 className={styles.groupTitle}>{GROUP_LABELS[group]}</h3>
                <div className={styles.grid}>
                  {list.map((m) => (
                    <article key={m.id} className={styles.card}>
                      {/* Avatar / photo */}
                      <div className={styles.avatar}>
                        {m.photo_url ? (
                          <img src={m.photo_url} alt={m.name} loading="lazy" />
                        ) : (
                          <span className={styles.initials}>
                            {initials(m.name)}
                          </span>
                        )}
                      </div>

                      <div className={styles.cardBody}>
                        <h4 className={styles.name}>{m.name}</h4>
                        {m.role && (
                          <p className={styles.role}>{m.role}</p>
                        )}

                        {m.bio && (
                          <>
                            <div
                              className={`${styles.bio} ${
                                expanded[m.id] ? styles.bioExpanded : ""
                              }`}
                            >
                              {m.bio.split("\n").filter(Boolean).map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
                            <button
                              className={styles.toggle}
                              onClick={() => toggle(m.id)}
                              aria-expanded={!!expanded[m.id]}
                            >
                              {expanded[m.id] ? "Read less ↑" : "Read more ↓"}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}