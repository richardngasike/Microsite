// Single source of truth for navigation and site metadata.
// Header and footer both read from here so links are never duplicated by hand.

export const SITE = {
  name: "UNAIDS Sustainability",
  title: "HIV Response Sustainability",
  tagline: "A new approach to ensure the sustainability of the HIV response.",
  org: "UNAIDS",
  year: new Date().getFullYear(),
};

// Primary navigation — used by the header only.
// Red-bar section menu. Country Profiles, Sustainability Roadmaps and GC8 are
// intentionally NOT repeated here — they are the three featured "For ..." quick
// links in the white row of the header (see FEATURED_LINKS in Header.js), so
// listing them again would duplicate navigation.
export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Advisory Committee", href: "/advisory-committee" },
  { label: "Technical Guidance", href: "/technical-guidance" },
  { label: "News", href: "/news" },
  { label: "Resources", href: "/resources" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

// Footer keeps a deliberately different, minimal set — no header links reused.
// Only utility / legal links live here, matching a lean institutional footer.
export const FOOTER_UTILITY = [
  { label: "Report fraud, abuse, misconduct", href: "/contact" },
  { label: "Scam alert", href: "https://www.unaids.org/en/scam_alert", external: true },
  { label: "Terms of use", href: "https://www.unaids.org/en/terms-of-use", external: true },
  { label: "Privacy", href: "https://www.unaids.org/en/privacy-policy", external: true },
];

// The five sustainability domains — real UNAIDS framework content.
export const DOMAINS = [
  {
    key: "political",
    number: "01",
    title: "Political leadership and commitment",
    summary:
      "Sustained political ownership and accountability that keeps the HIV response high on national agendas.",
  },
  {
    key: "laws",
    number: "02",
    title: "Enabling laws and policies",
    summary:
      "Legal and policy environments that protect rights and remove barriers to services.",
  },
  {
    key: "financing",
    number: "03",
    title: "Sustainable and equitable financing",
    summary:
      "Domestic and diversified financing directed toward the most impactful interventions.",
  },
  {
    key: "services",
    number: "04",
    title: "Science-driven, high-impact services",
    summary:
      "Effective, evidence-based HIV services and solutions tailored to each epidemic.",
  },
  {
    key: "systems",
    number: "05",
    title: "Systems built to deliver",
    summary:
      "Resilient health and community systems capable of delivering at scale beyond 2030.",
  },
];