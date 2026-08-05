"""
Admin — the control centre.

Admins manage regions, countries, documents, GC8, news, FAQs, people and
contact messages here. The Document admin adds an "Upload file" field: when an
admin attaches a file, it is pushed to Supabase Storage, a thumbnail is
generated and uploaded, and the file/thumbnail URLs + file type are filled in
automatically.

The admin index also shows an analytics summary (total documents, total
downloads, top documents, recent download events).
"""

from django import forms
from django.contrib import admin
from django.db.models import Sum
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.html import format_html

from .models import (
    Region, Country, Document, DownloadEvent, NewsPost, Faq, Person,
    ContactMessage,
)
from . import storage


# --- Document form with upload -------------------------------------------
class DocumentAdminForm(forms.ModelForm):
    upload = forms.FileField(
        required=False,
        help_text="Attach a PDF, Word, Excel, PowerPoint, image or video. "
                  "It is uploaded to Supabase and a thumbnail is generated "
                  "automatically.",
    )

    class Meta:
        model = Document
        fields = "__all__"

    def save(self, commit=True):
        instance = super().save(commit=False)
        upload = self.cleaned_data.get("upload")
        if upload:
            try:
                result = storage.upload_document(upload.read(), upload.name)
                instance.file_type = result["file_type"]
                instance.file_path = result["file_path"]
                instance.file_url = result["file_url"]
                instance.thumbnail_url = result["thumbnail_url"]
            except Exception as exc:
                # Surface a clear message instead of a 500.
                raise forms.ValidationError(f"Upload failed: {exc}")
        if commit:
            instance.save()
        return instance


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    form = DocumentAdminForm
    list_display = ("title", "section", "category", "file_type",
                    "download_count", "published", "featured", "thumb")
    list_filter = ("section", "file_type", "published", "featured", "category")
    search_fields = ("title", "description")
    list_editable = ("published", "featured")
    readonly_fields = ("download_count", "file_url", "thumbnail_url", "file_path", "preview")
    fieldsets = (
        (None, {"fields": ("title", "slug", "description")}),
        ("Placement", {"fields": ("section", "category", "country", "featured", "order")}),
        ("File", {"fields": ("upload", "preview", "file_type",
                             "file_url", "thumbnail_url", "file_path")}),
        ("Publishing", {"fields": ("published", "published_date", "download_count")}),
    )
    prepopulated_fields = {"slug": ("title",)}

    def thumb(self, obj):
        if obj.thumbnail_url:
            return format_html('<img src="{}" style="height:40px;border-radius:4px" />', obj.thumbnail_url)
        return "—"
    thumb.short_description = "Thumbnail"

    def preview(self, obj):
        if obj.thumbnail_url:
            return format_html('<img src="{}" style="max-height:180px;border-radius:8px" />', obj.thumbnail_url)
        return "No thumbnail yet."


class CountryInline(admin.TabularInline):
    model = Country
    extra = 1
    prepopulated_fields = {"slug": ("name",)}
    fields = ("name", "slug", "flag_url", "order")


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "country_count", "order")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CountryInline]

    def country_count(self, obj):
        return obj.countries.count()


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "order")
    list_filter = ("region",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(NewsPost)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "published", "published_date")
    list_filter = ("published", "category")
    search_fields = ("title", "excerpt", "body")
    list_editable = ("published",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ("question", "order", "published")
    list_editable = ("order", "published")


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "order", "published")
    list_editable = ("order", "published")


@admin.register(ContactMessage)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "handled")
    list_filter = ("handled",)
    list_editable = ("handled",)
    readonly_fields = ("name", "email", "subject", "message", "created_at")


@admin.register(DownloadEvent)
class DownloadEventAdmin(admin.ModelAdmin):
    list_display = ("document", "created_at", "ip")
    list_filter = ("created_at",)


# --- Analytics dashboard ---------------------------------------------------
# Attach an /admin/analytics/ view to the default admin site by extending its
# get_urls. This keeps every model registered on the default site while adding
# the dashboard the brief asks for (total downloads, top documents, etc.).
admin.site.site_header = "UNAIDS Sustainability — Administration"
admin.site.site_title = "UNAIDS Sustainability Admin"
admin.site.index_title = "Content & analytics"


def _analytics_view(request):
    totals = {
        "documents": Document.objects.count(),
        "downloads": Document.objects.aggregate(t=Sum("download_count"))["t"] or 0,
        "news": NewsPost.objects.count(),
        "countries": Country.objects.count(),
        "messages": ContactMessage.objects.filter(handled=False).count(),
    }
    top = Document.objects.order_by("-download_count")[:10]
    recent = DownloadEvent.objects.select_related("document")[:15]
    context = {
        **admin.site.each_context(request),
        "totals": totals,
        "top": top,
        "recent": recent,
        "title": "Analytics",
    }
    return TemplateResponse(request, "admin/analytics.html", context)


_original_get_urls = admin.site.get_urls


def _patched_get_urls():
    extra = [
        path("analytics/", admin.site.admin_view(_analytics_view), name="analytics"),
    ]
    return extra + _original_get_urls()


admin.site.get_urls = _patched_get_urls
