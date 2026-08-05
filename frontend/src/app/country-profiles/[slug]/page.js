import CountryDetail from "./CountryDetail";

// Static-export shim: content is fetched client-side by slug so new countries
// added in the admin need no rebuild.
export function generateStaticParams() {
  return [{ slug: "index" }];
}
export const dynamicParams = false;

export default function CountryProfileDetailPage() {
  return <CountryDetail />;
}
