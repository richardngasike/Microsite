"""
Supabase Storage integration.

Uploads a document to the configured Supabase bucket, generates a thumbnail
(page 1 for PDFs, a rendered icon for office files, the image itself for
images), uploads that too, and returns public URLs for both.

This is called from the admin when a file is attached, so admins only pick a
file and everything else — storage, thumbnail, public URL — happens for them.

Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET in settings.
"""

import io
import os
import uuid
from django.conf import settings

try:
    from supabase import create_client
except Exception:  # library optional at import time
    create_client = None

from PIL import Image, ImageDraw, ImageFont


FILE_TYPE_BY_EXT = {
    ".pdf": "pdf",
    ".doc": "docx", ".docx": "docx",
    ".xls": "xlsx", ".xlsx": "xlsx", ".csv": "xlsx",
    ".ppt": "pptx", ".pptx": "pptx",
    ".png": "image", ".jpg": "image", ".jpeg": "image", ".webp": "image", ".gif": "image",
    ".mp4": "video", ".mov": "video",
}


def _client():
    if not create_client:
        raise RuntimeError("supabase package not installed.")
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise RuntimeError("Supabase credentials are not configured.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


def detect_file_type(filename: str) -> str:
    return FILE_TYPE_BY_EXT.get(os.path.splitext(filename)[1].lower(), "other")


def _public_url(client, path: str) -> str:
    return client.storage.from_(settings.SUPABASE_BUCKET).get_public_url(path)


def _make_thumbnail(data: bytes, filename: str, file_type: str) -> bytes:
    """Return PNG thumbnail bytes for the given file."""
    ext = os.path.splitext(filename)[1].lower()

    # Images: downscale the image itself.
    if file_type == "image":
        try:
            img = Image.open(io.BytesIO(data)).convert("RGB")
            img.thumbnail((600, 450))
            out = io.BytesIO()
            img.save(out, format="PNG")
            return out.getvalue()
        except Exception:
            pass

    # PDFs: render first page if pdf2image/poppler is available.
    if file_type == "pdf":
        try:
            from pdf2image import convert_from_bytes
            pages = convert_from_bytes(data, first_page=1, last_page=1, size=(600, None))
            if pages:
                out = io.BytesIO()
                pages[0].save(out, format="PNG")
                return out.getvalue()
        except Exception:
            pass

    # Fallback: a branded placeholder card with the file-type label.
    return _placeholder_thumb(file_type.upper())


def _placeholder_thumb(label: str) -> bytes:
    img = Image.new("RGB", (600, 450), "#f5f5f6")
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 600, 90], fill="#e31837")
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 60)
        small = ImageFont.truetype("DejaVuSans-Bold.ttf", 34)
    except Exception:
        font = ImageFont.load_default()
        small = font
    draw.text((40, 20), "UNAIDS", fill="#ffffff", font=small)
    draw.text((40, 190), label, fill="#e31837", font=font)
    out = io.BytesIO()
    img.save(out, format="PNG")
    return out.getvalue()


def upload_document(data: bytes, filename: str):
    """Upload file + thumbnail to Supabase. Returns dict with urls + metadata."""
    client = _client()
    bucket = client.storage.from_(settings.SUPABASE_BUCKET)

    file_type = detect_file_type(filename)
    key_base = f"{uuid.uuid4().hex}"
    ext = os.path.splitext(filename)[1].lower() or ".bin"
    file_key = f"files/{key_base}{ext}"
    thumb_key = f"thumbnails/{key_base}.png"

    # Upload the main file.
    bucket.upload(file_key, data, {"content-type": _mime(ext), "upsert": "true"})

    # Build + upload the thumbnail.
    thumb = _make_thumbnail(data, filename, file_type)
    bucket.upload(thumb_key, thumb, {"content-type": "image/png", "upsert": "true"})

    return {
        "file_type": file_type,
        "file_path": file_key,
        "file_url": _public_url(client, file_key),
        "thumbnail_url": _public_url(client, thumb_key),
    }


def _mime(ext: str) -> str:
    return {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".ppt": "application/vnd.ms-powerpoint",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".webp": "image/webp", ".gif": "image/gif",
        ".mp4": "video/mp4",
    }.get(ext, "application/octet-stream")
