"""
Seed baseline structure using real UNAIDS content.

Creates the standard UNAIDS regions and a set of FAQs drawn from the live
sustainability site, so a fresh install isn't empty. Documents, countries and
news are left for admins to add (with their real files) via the admin.

Run: python manage.py seed_content
"""

from django.core.management.base import BaseCommand
from core.models import Region, Faq


# UNAIDS regional structure (used across UNAIDS reporting).
REGIONS = [
    "Asia and the Pacific",
    "Caribbean",
    "Eastern and southern Africa",
    "Eastern Europe and central Asia",
    "Latin America",
    "Middle East and North Africa",
    "Western and central Africa",
    "Western and central Europe and North America",
]

FAQS = [
    {
        "question": "What is the new HIV Response Sustainability Approach?",
        "answer": "<p>UNAIDS has proposed a new approach to ensure the sustainability of the "
                  "HIV response. Its vision is to galvanize efforts and drive sustainable HIV "
                  "response transformations to reach and maintain epidemic control beyond 2030, "
                  "by upholding the right to health for all.</p>",
    },
    {
        "question": "What are the five sustainability domains?",
        "answer": "<p>The approach is holistic across five domains: political leadership and "
                  "commitment; enabling laws and policies; sustainable and equitable financing; "
                  "science-driven, effective and high-impact HIV services and solutions; and "
                  "systems built to deliver.</p>",
    },
    {
        "question": "What is a Sustainability Roadmap?",
        "answer": "<p>A country-specific plan built on the sustainability framework that helps "
                  "countries navigate the path towards sustainability across the programmatic, "
                  "political, structural and financial dimensions of the HIV response.</p>",
    },
    {
        "question": "What is the Sustainability Assessment tool?",
        "answer": "<p>A tool that empowers stakeholders to identify and address risks across "
                  "political, structural, financial and programmatic domains, and to discover new "
                  "strategies to enhance the HIV response towards 2030 and beyond.</p>",
    },
    {
        "question": "Where can I find country-specific data?",
        "answer": "<p>The country profiles provide an analytical resource package presenting data "
                  "and qualitative information related to each country's sustainability landscape. "
                  "Select a country from the Country Profiles page.</p>",
    },
]


class Command(BaseCommand):
    help = "Seed baseline regions and FAQs with real UNAIDS content."

    def handle(self, *args, **options):
        for i, name in enumerate(REGIONS):
            Region.objects.get_or_create(name=name, defaults={"order": i})
        self.stdout.write(self.style.SUCCESS(f"Regions ready: {len(REGIONS)}"))

        for i, f in enumerate(FAQS):
            Faq.objects.get_or_create(
                question=f["question"], defaults={"answer": f["answer"], "order": i}
            )
        self.stdout.write(self.style.SUCCESS(f"FAQs ready: {len(FAQS)}"))
        self.stdout.write(self.style.SUCCESS("Seed complete."))
