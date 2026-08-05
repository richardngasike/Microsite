"""
Data model for the UNAIDS Sustainability site.

Everything the public site shows is defined here and managed from the Django
admin: regions and countries, downloadable documents (stored in Supabase with a
thumbnail), GC8 documents, news/blog posts, FAQs, team people and contact
messages. Download analytics are tracked per document and per event.
"""

from django.db import models
from django.utils.text import slugify


# --- Shared choices --------------------------------------------------------
class DocumentSection(models.TextChoices):
    RESOURCE = "resource", "Resource"
    GUIDANCE = "guidance", "Technical Guidance"
    GC8 = "gc8", "GC8"
    COUNTRY = "country", "Country Profile"


FILE_TYPES = [
    ("pdf", "PDF"),
    ("docx", "Word"),
    ("xlsx", "Excel"),
    ("pptx", "PowerPoint"),
    ("image", "Image"),
    ("video", "Video"),
    ("other", "Other"),
]


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# --- Regions & Countries ---------------------------------------------------
class Region(TimeStamped):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Country(TimeStamped):
    region = models.ForeignKey(Region, related_name="countries", on_delete=models.CASCADE)
    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    # Flag stored in Supabase; store the public URL.
    flag_url = models.URLField(blank=True)
    summary = models.TextField(blank=True, help_text="Rich HTML shown on the country page.")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Countries"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# --- Documents -------------------------------------------------------------
class Document(TimeStamped):
    """A downloadable file stored in Supabase Storage with a thumbnail.

    `section` decides which page it appears on (resources, guidance, GC8, or a
    country profile). `category` is a free label used by the on-page filters.
    """

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField(blank=True)

    section = models.CharField(
        max_length=20, choices=DocumentSection.choices, default=DocumentSection.RESOURCE
    )
    category = models.CharField(max_length=80, blank=True)

    # Country is only relevant when section == COUNTRY.
    country = models.ForeignKey(
        Country, related_name="documents", null=True, blank=True, on_delete=models.SET_NULL
    )

    file_type = models.CharField(max_length=10, choices=FILE_TYPES, default="pdf")

    # Supabase public URLs. Filled automatically on upload (see admin/storage),
    # or pasted manually. `file_path` keeps the storage key for management.
    file_url = models.URLField(blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    thumbnail_url = models.URLField(blank=True)

    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    published_date = models.DateField(null=True, blank=True)
    download_count = models.PositiveIntegerField(default=0)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-published_date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:270]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class DownloadEvent(models.Model):
    """One row per download — powers time-series analytics in the admin."""

    document = models.ForeignKey(Document, related_name="events", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["-created_at"]


# --- News / Blog -----------------------------------------------------------
class NewsPost(TimeStamped):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    category = models.CharField(max_length=80, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True, help_text="Rich HTML article body.")
    image_url = models.URLField(blank=True, help_text="Cover image (Supabase).")
    # If set, the card links out to the source instead of a detail page.
    external_url = models.URLField(blank=True)
    published = models.BooleanField(default=True)
    published_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-published_date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:270]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# --- FAQs ------------------------------------------------------------------
class Faq(TimeStamped):
    question = models.CharField(max_length=300)
    answer = models.TextField(help_text="Rich HTML answer.")
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.question


# --- People / Team ---------------------------------------------------------
class Person(TimeStamped):
    name = models.CharField(max_length=160)
    role = models.CharField(max_length=200, blank=True)
    photo_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "People"

    def __str__(self):
        return self.name


# --- Contact ---------------------------------------------------------------
class ContactMessage(models.Model):
    name = models.CharField(max_length=160)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject or 'No subject'}"
