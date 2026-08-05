import PostDetail from "./PostDetail";

// For static export, Next needs to know which slugs exist at build time.
// We return an empty list and render the actual content on the client by
// reading the slug from the URL. This keeps the export fully static while the
// content stays 100% backend-driven (new posts need no rebuild).
export function generateStaticParams() {
  return [{ slug: "index" }];
}

export const dynamicParams = false;

export default function NewsDetailPage() {
  return <PostDetail />;
}
