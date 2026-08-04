from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("entry/<int:entry_id>/", views.entry_detail, name="entry_detail"),
    # path('entry/add/', views.add_entry, name='add_entry'),
    # path('entry/<int:entry_id>/edit/', views.edit_entry, name='edit_entry'),
    # path('entry/<int:entry_id>/delete/', views.delete_entry, name='delete_entry'),
    path(
        "category/<int:category_id>/", views.category_entries, name="category_entries"
    ),
    path("search/", views.search_results, name="search_results"),
    # path('generate/', views.generate_entry, name='generate_entry'),
    path("api/entries/", views.api_home, name="api_home"),
    path("api/entries/add/", views.api_add_entry, name="api_add_entry"),
    path(
        "api/entries/<int:entry_id>/delete/",
        views.api_delete_entry,
        name="api_delete_entry",
    ),
    path(
        "api/entries/<int:entry_id>/edit/", views.api_edit_entry, name="api_edit_entry"
    ),
    path("api/categories/", views.api_categories, name="api_categories"),
    path(
        "api/categories/<int:category_id>/",
        views.api_category_entries,
        name="api_category_entries",
    ),
    path("api/search/", views.api_search_results, name="api_search_results"),
    # path('api/entries/generate/', views.api_generate_entry, name='api_generate_entry'),
    path(
        "api/entries/<int:entry_id>/", views.api_entry_detail, name="api_entry_detail"
    ),
]
