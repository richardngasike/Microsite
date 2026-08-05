from django.urls import path
from . import views

urlpatterns = [
    # Documents by section
    path("documents/", views.ResourceList.as_view()),
    path("guidance/", views.GuidanceList.as_view()),
    path("gc8/", views.GC8List.as_view()),
    path("roadmaps/", views.RoadmapList.as_view()),
    path("documents/<int:pk>/download/", views.track_download),
    path("documents/<slug:slug>/", views.DocumentDetail.as_view()),

    # Regions & countries
    path("regions/", views.RegionList.as_view()),
    path("countries/<slug:slug>/", views.CountryDetail.as_view()),

    # News
    path("news/", views.NewsList.as_view()),
    path("news/<slug:slug>/", views.NewsDetail.as_view()),

    # FAQs & people
    path("faqs/", views.FaqList.as_view()),
    path("advisory-committee/", views.AdvisoryMemberList.as_view()),
    path("people/", views.PersonList.as_view()),

    # Contact & search
    path("contact/", views.contact),
    path("search/", views.search),

    # Auth
    path("auth/me/", views.me),
    path("auth/register/", views.register),
    path("auth/login/", views.login),
]
