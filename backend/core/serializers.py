from rest_framework import serializers
from .models import (
    Region, Country, Document, NewsPost, Faq, Person, ContactMessage,
    AdvisoryMember,
)


class DocumentSerializer(serializers.ModelSerializer):
    file_type = serializers.CharField(source="get_file_type_display")

    class Meta:
        model = Document
        fields = [
            "id", "title", "slug", "description", "category", "section",
            "file_type", "file_url", "thumbnail_url",
            "download_count", "published_date",
        ]


class CountryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["name", "slug", "flag_url"]


class RegionSerializer(serializers.ModelSerializer):
    countries = serializers.SerializerMethodField()

    class Meta:
        model = Region
        fields = ["name", "slug", "countries"]

    def get_countries(self, obj):
        return CountryListSerializer(obj.countries.all(), many=True).data


class CountryDetailSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source="region.name", read_only=True)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ["name", "slug", "flag_url", "summary", "region_name", "documents"]

    def get_documents(self, obj):
        qs = obj.documents.filter(published=True)
        return DocumentSerializer(qs, many=True).data


class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsPost
        fields = [
            "title", "slug", "category", "excerpt",
            "image_url", "external_url", "published_date",
        ]


class NewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsPost
        fields = [
            "title", "slug", "category", "excerpt", "body",
            "image_url", "external_url", "published_date",
        ]


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ["id", "question", "answer"]


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["id", "name", "role", "photo_url"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]


class AdvisoryMemberSerializer(serializers.ModelSerializer):
    group_display = serializers.CharField(source="get_group_display", read_only=True)

    class Meta:
        model = AdvisoryMember
        fields = ["id", "name", "role", "group", "group_display", "bio", "photo_url", "order"]
