from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import (
    Region, Country, Document, DownloadEvent, NewsPost, Faq, Person,
    ContactMessage, DocumentSection, AdvisoryMember,
)
from .serializers import (
    RegionSerializer, CountryDetailSerializer, DocumentSerializer,
    NewsListSerializer, NewsDetailSerializer, FaqSerializer, PersonSerializer,
    ContactMessageSerializer, AdvisoryMemberSerializer,
)

User = get_user_model()


def _published_docs(section=None):
    qs = Document.objects.filter(published=True)
    if section:
        qs = qs.filter(section=section)
    return qs


# --- Documents by section -------------------------------------------------
class ResourceList(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        # ?featured=true → return featured docs from ANY section.
        # This powers the homepage "Featured resources" grid — admin marks any
        # document as Featured regardless of section and it shows on the homepage.
        if self.request.query_params.get("featured") == "true":
            return (
                Document.objects
                .filter(published=True, featured=True)
                .order_by("order", "-published_date")
            )
        # No param → Resources page: return RESOURCE section only
        return _published_docs(DocumentSection.RESOURCE)


class GuidanceList(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return _published_docs(DocumentSection.GUIDANCE)


class GC8List(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return _published_docs(DocumentSection.GC8)


class RoadmapList(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        qs = _published_docs(DocumentSection.ROADMAP)
        # ?country=<slug> — used by the Sustainability Roadmaps drill-down page
        country_slug = self.request.query_params.get("country")
        if country_slug:
            qs = qs.filter(country__slug=country_slug)
        return qs


class DocumentDetail(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Document.objects.filter(published=True)


# --- Download tracking ----------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def track_download(request, pk):
    try:
        doc = Document.objects.get(pk=pk)
    except Document.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    Document.objects.filter(pk=pk).update(download_count=doc.download_count + 1)
    DownloadEvent.objects.create(
        document=doc,
        ip=_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", "")[:300],
    )
    return Response({"ok": True})


def _client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR")


# --- Regions & countries --------------------------------------------------
class RegionList(generics.ListAPIView):
    serializer_class = RegionSerializer
    queryset = Region.objects.prefetch_related("countries").all()


class CountryDetail(generics.RetrieveAPIView):
    serializer_class = CountryDetailSerializer
    lookup_field = "slug"
    queryset = Country.objects.all()


# --- News -----------------------------------------------------------------
class NewsList(generics.ListAPIView):
    serializer_class = NewsListSerializer
    queryset = NewsPost.objects.filter(published=True)


class NewsDetail(generics.RetrieveAPIView):
    serializer_class = NewsDetailSerializer
    lookup_field = "slug"
    queryset = NewsPost.objects.filter(published=True)


# --- FAQs & People --------------------------------------------------------
class FaqList(generics.ListAPIView):
    serializer_class = FaqSerializer
    queryset = Faq.objects.filter(published=True)
    pagination_class = None


class PersonList(generics.ListAPIView):
    serializer_class = PersonSerializer
    queryset = Person.objects.filter(published=True)
    pagination_class = None


# --- Advisory Committee ---------------------------------------------------
class AdvisoryMemberList(generics.ListAPIView):
    serializer_class = AdvisoryMemberSerializer
    pagination_class = None

    def get_queryset(self):
        return AdvisoryMember.objects.filter(published=True)


# --- Contact --------------------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def contact(request):
    serializer = ContactMessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"ok": True}, status=status.HTTP_201_CREATED)


# --- Global search --------------------------------------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def search(request):
    q = request.query_params.get("q", "").strip()
    if not q:
        return Response({"results": []})

    results = []

    for d in Document.objects.filter(published=True).filter(
        Q(title__icontains=q) | Q(description__icontains=q)
    )[:8]:
        results.append({
            "type": _section_label(d.section),
            "id": d.id,
            "title": d.title,
            "excerpt": d.description[:140],
            "url": _doc_url(d),
        })

    for n in NewsPost.objects.filter(published=True).filter(
        Q(title__icontains=q) | Q(excerpt__icontains=q) | Q(body__icontains=q)
    )[:6]:
        results.append({
            "type": "News",
            "id": n.id,
            "title": n.title,
            "excerpt": n.excerpt[:140],
            "url": n.external_url or f"/news/{n.slug}",
        })

    for c in Country.objects.filter(name__icontains=q)[:6]:
        results.append({
            "type": "Country",
            "id": c.id,
            "title": c.name,
            # Use query param URL so the country profiles page auto-opens
            # the correct region + country panel — no 404 on static export
            "excerpt": f"Country profile — {c.region.name}",
            "url": f"/country-profiles/?country={c.slug}",
        })

    for f in Faq.objects.filter(published=True).filter(
        Q(question__icontains=q) | Q(answer__icontains=q)
    )[:4]:
        results.append({
            "type": "FAQ",
            "id": f.id,
            "title": f.question,
            "excerpt": "",
            "url": "/faqs/",
        })

    return Response({"results": results})


def _section_label(section):
    return {
        DocumentSection.RESOURCE: "Resource",
        DocumentSection.GUIDANCE: "Guidance",
        DocumentSection.GC8: "GC8",
        DocumentSection.ROADMAP: "Roadmap",
        DocumentSection.COUNTRY: "Country document",
    }.get(section, "Document")


def _doc_url(d):
    if d.section == DocumentSection.GUIDANCE:
        return "/technical-guidance/"
    if d.section == DocumentSection.GC8:
        return "/gc8/"
    if d.section == DocumentSection.ROADMAP:
        return "/sustainability-roadmaps/"
    if d.section == DocumentSection.COUNTRY and d.country_id:
        return f"/country-profiles/?country={d.country.slug}"
    return "/resources/"


# --- Auth -----------------------------------------------------------------
@api_view(["GET"])
def me(request):
    if not request.user.is_authenticated:
        return Response({"error": "Not authenticated."}, status=401)
    return Response({
        "name": request.user.first_name or request.user.username,
        "email": request.user.email,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email    = request.data.get("email")
    password = request.data.get("password")
    name     = request.data.get("name", "")
    if not email or not password:
        return Response({"error": "Email and password required."}, status=400)
    if User.objects.filter(username=email).exists():
        return Response({"error": "Account already exists."}, status=400)
    user = User.objects.create_user(
        username=email, email=email, password=password, first_name=name[:150]
    )
    Token.objects.get_or_create(user=user)
    return Response({"ok": True}, status=201)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email    = request.data.get("email")
    password = request.data.get("password")
    user     = authenticate(username=email, password=password)
    if not user:
        return Response({"error": "Invalid credentials."}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "name": user.first_name})