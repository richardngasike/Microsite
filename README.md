# UNAIDS HIV Response Sustainability — Full-Stack Platform

A rebuild of the UNAIDS Sustainability site (WordPress → Next.js + Django).

- **Frontend:** Next.js (App Router), traditional per-component `*.module.css`,
  Avenir font, sliding hero, working global search. Deployable as a **fully
  static site** on Vercel, Netlify, or any static host.
- **Backend:** Django + Django REST Framework. Admins control everything;
  documents (and their thumbnails) live in **Supabase Storage**; the database
  is **Supabase Postgres**. A built-in analytics dashboard tracks downloads.

The frontend calls the backend from the browser at runtime, so the export
stays static while content updates need no rebuild.

---

## 1. Repository layout

```
unaids-sustainability/
├── frontend/                 Next.js app (static export)
│   ├── src/
│   │   ├── app/              pages (home, about, gc8, news, country-profiles…)
│   │   ├── components/       Header, Footer, HeroSlider, cards… (+ .module.css)
│   │   ├── lib/              site.js (nav config), api.js (backend client)
│   │   └── styles/globals.css   brand tokens + Avenir @font-face
│   ├── public/               ← put fonts, logos, hero images here
│   └── next.config.mjs       output: "export"
└── backend/                  Django + DRF
    ├── config/               settings, urls, wsgi
    ├── core/                 models, serializers, views, admin, storage
    ├── .env.example
    └── manage.py
```

---

## 2. Backend setup (Django + Supabase)

### 2.1 Create the Supabase project
1. Create a project at supabase.com.
2. **Database:** Settings → Database → copy the connection string (URI).
3. **Storage:** create a bucket named `documents` and mark it **public**
   (so file and thumbnail URLs are directly viewable).
4. **API keys:** Settings → API → copy the project URL and the
   **service_role** key (server-side only — never ship it to the frontend).

### 2.2 Configure and run
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env      # then fill in the values (see below)

python manage.py migrate
python manage.py seed_content        # loads regions + FAQs
python manage.py createsuperuser
python manage.py runserver
```

### 2.3 `.env` values
| Variable | What it is |
|---|---|
| `SECRET_KEY` | Any long random string |
| `DEBUG` | `True` locally, `False` in production |
| `ALLOWED_HOSTS` | Your API domain(s), comma-separated |
| `CORS_ALLOWED_ORIGINS` | Your frontend URL(s), e.g. `https://xxx.vercel.app` |
| `DATABASE_URL` | Supabase Postgres connection string |
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key |
| `SUPABASE_BUCKET` | `documents` |

If `DATABASE_URL` is left blank, Django falls back to local SQLite — handy for
a quick first run before Supabase is wired up.

---

## 3. Admin — what you control

Log in at `/admin/`. Everything the public site shows is managed here:

- **Regions & Countries** — countries are grouped under regions; add flags and a
  rich HTML summary per country.
- **Documents** — attach a PDF/Word/Excel/PowerPoint/image/video with the
  **Upload** field. On save it is pushed to Supabase, a **thumbnail is generated
  and uploaded automatically**, and the file URL / thumbnail URL / file type are
  filled in for you. Choose which page it appears on via **Section**
  (Resource, Technical Guidance, GC8, or a Country profile) and add a free-text
  **Category** for the on-page filter chips.
- **News / Blog** — title, image, excerpt, rich HTML body, category, and an
  optional external link (cards link out when set, otherwise to a detail page).
- **FAQs**, **People** (team), **Contact messages**.
- **Analytics** — button on the admin home, or `/admin/analytics/`: total
  downloads, documents, news, countries, unhandled messages, most-downloaded
  documents, and recent download events. Each document also shows its own count.



---

## 4. Frontend setup



### 4.2 Run / build
```bash
cd frontend
npm install

# point the frontend at your API
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000/api' > .env.local

npm run dev          # local development
npm run build        # static export → frontend/out/
```

---

## 5. Deployment

### Frontend (static)
**Vercel:** import the repo, set root to `frontend/`, add env var
`NEXT_PUBLIC_API_URL` = your API URL. Vercel detects Next.js and serves the
static export.

**Netlify:** base directory `frontend`, build command `npm run build`, publish
directory `frontend/out`, same env var.

Any static host works too — just upload the contents of `frontend/out/`.

### Backend
Deploy `backend/` to any Python host (Render, Railway, Fly.io, a VPS…):
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi
```
Set `DEBUG=False`, real `ALLOWED_HOSTS`, and add your deployed frontend URL to
`CORS_ALLOWED_ORIGINS`.

---



## 7. API reference (public, read-only)

| Endpoint | Returns |
|---|---|
| `GET /api/documents/` | Resources (`?featured=true`) |
| `GET /api/guidance/` | Technical guidance documents |
| `GET /api/gc8/` | GC8 documents |
| `POST /api/documents/{id}/download/` | Records a download |
| `GET /api/regions/` | Regions with their countries |
| `GET /api/countries/{slug}/` | Country profile + documents |
| `GET /api/news/` · `/api/news/{slug}/` | News list / article |
| `GET /api/faqs/` · `/api/people/` | FAQs / team |
| `GET /api/search/?q=` | Global search |
| `POST /api/contact/` | Submit a contact message |
| `POST /api/auth/register/` · `/api/auth/login/` | Account creation / sign in |

---

## 8. Content note

