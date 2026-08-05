# Frontend — UNAIDS Sustainability

Next.js (App Router) static-export site.

## Quick start
```bash
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000/api' > .env.local
npm run dev
```

## Build (static export)
```bash
npm run build      # → ./out  (deploy this folder anywhere)
```

## Where things live
- `src/lib/site.js` — navigation, footer links, the five domains (single source
  of truth; header/footer never duplicate links by hand).
- `src/lib/api.js` — backend client. Set `NEXT_PUBLIC_API_URL`.
- `src/styles/globals.css` — brand tokens + Avenir `@font-face`.
- `src/components/*` — each with its own `.module.css`.
