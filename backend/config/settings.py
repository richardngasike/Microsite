"""
Django settings — UNAIDS HIV Response Sustainability backend.

Key fixes vs previous version:
  • Uses django.db.backends.postgresql (works with psycopg3 via psycopg[binary])
  • DATABASE_URL parser handles both postgres:// and postgresql:// schemes
  • sslmode passed via OPTIONS dict compatible with psycopg3
  • STATIC_ROOT + WhiteNoise-ready STATICFILES_DIRS removed (not needed)
  • SECURE_* headers enabled when DEBUG=False for production safety
"""

import os
import re
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env if present (local dev). On Render/Railway set env vars in dashboard.
load_dotenv(BASE_DIR / ".env")

# ── Core ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-insecure-please-change-in-production")
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

_raw_hosts = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [h.strip() for h in _raw_hosts.split(",") if h.strip()]

# ── Applications ──────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "core",
]


# ── Middleware ─────────────────────────────────────────────────────────────
MIDDLEWARE = [
    # Security
    "django.middleware.security.SecurityMiddleware",

    # Serve static files (Render/Production)
    "whitenoise.middleware.WhiteNoiseMiddleware",

    # CORS
    "corsheaders.middleware.CorsMiddleware",

    # Django middleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ── Database ──────────────────────────────────────────────────────────────
# psycopg3 (psycopg[binary]) is fully supported by the standard
# django.db.backends.postgresql backend from Django 4.2+.
# We parse DATABASE_URL ourselves to keep the dependency list lean.

DATABASE_URL = os.environ.get("DATABASE_URL", "")

if DATABASE_URL:
    # Accept both postgres:// and postgresql:// (Supabase uses the former)
    _db_url = DATABASE_URL.strip()
    _m = re.match(
        r"postgres(?:ql)?://(?P<user>[^:@]+)(?::(?P<pw>[^@]*))?@(?P<host>[^:/]+)(?::(?P<port>\d+))?/(?P<name>[^?]+)",
        _db_url,
    )
    if not _m:
        raise ValueError(
            f"Could not parse DATABASE_URL. Expected format:\n"
            f"  postgres://user:password@host:port/dbname\n"
            f"Got: {_db_url[:40]}…"
        )
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": _m.group("name"),
            "USER": _m.group("user"),
            "PASSWORD": _m.group("pw") or "",
            "HOST": _m.group("host"),
            "PORT": _m.group("port") or "5432",
            "OPTIONS": {
                # sslmode=require is correct for Supabase and most managed PG hosts.
                # psycopg3 reads this from OPTIONS just like psycopg2 did.
                "sslmode": "require",
            },
            "CONN_MAX_AGE": 60,  # reuse connections — important on Render free tier
        }
    }
else:
    # Local development fallback — SQLite requires no extra packages
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ── Password validation ───────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ──────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ── Static files ──────────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"



# ── Django REST Framework ─────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        # All API endpoints are public-read by default.
        # Write operations happen through the Django admin only.
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 24,
}

# ── CORS ──────────────────────────────────────────────────────────────────
# The static Next.js frontend calls this API from the browser.
# Add your Vercel/Netlify domain to CORS_ALLOWED_ORIGINS in the environment.
_raw_cors = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
CORS_ALLOWED_ORIGINS = [o.strip() for o in _raw_cors.split(",") if o.strip()]
CORS_ALLOW_CREDENTIALS = True

# ── Supabase Storage ──────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "documents")

# ── Security headers (production only) ───────────────────────────────────
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
