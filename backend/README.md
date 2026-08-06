# UNAIDS Sustainability — Backend API

Django 5.2 + Django REST Framework backend for the HIV Response Sustainability platform.

## Quick start (local)

```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your values
python manage.py migrate
python manage.py seed_content # loads real UNAIDS regions + FAQs
python manage.py createsuperuser
python manage.py runserver
```

API available at `http://localhost:8000/api/`
Admin at `http://localhost:8000/admin/`

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` Any long random string (50+ chars) |
| `DEBUG`  `False` in production, `True` locally |
| `ALLOWED_HOSTS`  Comma-separated hostnames, e.g. `api.yourdomain.com` |
| `CORS_ALLOWED_ORIGINS`  Frontend URL(s), e.g. `https://xxx.vercel.app` |
| `DATABASE_URL`  Supabase Postgres URI (see below) |
| `SUPABASE_URL` `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` Supabase service_role key |
| `SUPABASE_BUCKET` | — | Storage bucket name, default `documents` |

---

## Supabase setup

### Database
1. Supabase dashboard → Settings → Database → **Transaction pooler** connection string
2. Copy the URI (starts with `postgres://`) → set as `DATABASE_URL`
3. Use the **Transaction pooler** (port 6543), not the direct connection (port 5432), for serverless/Render deployments

### Storage
1. Supabase → Storage → Create bucket named `documents`
2. Set bucket to **Public**
3. Supabase → Settings → API → copy **service_role** key → set as `SUPABASE_SERVICE_KEY`

---

## Deploy on Render

1. Push this folder as a **separate repo** (or subdirectory) on GitHub
2. Render → New Web Service → connect repo
3. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. Start command: `gunicorn config.wsgi:application --workers 2 --timeout 120 --bind 0.0.0.0:$PORT`
5. Set all environment variables in Render dashboard
6. Python version is pinned to 3.12 via `runtime.txt`

**Important:** Render free tier spins down after inactivity. The first request after spin-down takes ~30s. Upgrade to a paid plan for production.

After first deploy, run the seed command once via Render Shell:
```bash
python manage.py seed_content
python manage.py createsuperuser
```

---

## Deploy on VPS (Ubuntu + Nginx + Gunicorn)

```bash
# 1. Install dependencies
sudo apt update && sudo apt install python3.12 python3.12-venv nginx

# 2. Clone / upload backend folder, create venv
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 3. Set environment variables in /etc/environment or a .env file

# 4. Migrate + collect static
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_content
python manage.py createsuperuser

# 5. Gunicorn systemd service (create /etc/systemd/system/unaids.service)
[Unit]
Description=UNAIDS Sustainability API
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/unaids-backend
EnvironmentFile=/var/www/unaids-backend/.env
ExecStart=/var/www/unaids-backend/.venv/bin/gunicorn config.wsgi:application \
    --workers 3 --bind unix:/run/unaids.sock --timeout 120
Restart=always

[Install]
WantedBy=multi-user.target

# 6. Nginx config (proxy /api/ and /admin/ to Gunicorn socket)
server {
    listen 80;
    server_name api.yourdomain.com;

    location /static/ { root /var/www/unaids-backend/staticfiles; }
    location / {
        proxy_pass http://unix:/run/unaids.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/documents/` | Resources (`?featured=true`) |
| GET | `/api/guidance/` | Technical guidance |
| GET | `/api/gc8/` | GC8 documents |
| GET | `/api/roadmaps/` | Sustainability roadmaps |
| GET | `/api/documents/<slug>/` | Single document |
| POST | `/api/documents/<id>/download/` | Track a download |
| GET | `/api/regions/` | Regions with countries |
| GET | `/api/countries/<slug>/` | Country profile + docs |
| GET | `/api/news/` | News list |
| GET | `/api/news/<slug>/` | News detail |
| GET | `/api/faqs/` | FAQs |
| GET | `/api/people/` | Team members |
| GET | `/api/advisory-committee/` | Advisory committee members |
| POST | `/api/contact/` | Submit contact message |
| GET | `/api/search/?q=` | Global search |
| GET | `/api/auth/me/` | Current user (token required) |
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Sign in → returns token |

Analytics dashboard: `/admin/analytics/`

---

## Python version

**Python 3.12** is required. The project uses `psycopg[binary]==3.2.9` (psycopg3)
which works with Django's standard `django.db.backends.postgresql` backend.

Do **not** use Python 3.14 on Render — it is experimental and breaks several
compiled packages. `runtime.txt` pins this to `python-3.12.9`.
