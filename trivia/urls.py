from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('entry/<int:entry_id>/', views.entry_detail, name='entry_detail'),
    path('entry/add/', views.add_entry, name='add_entry'),
    path('entry/<int:entry_id>/edit/', views.edit_entry, name='edit_entry'),
    path('entry/<int:entry_id>/delete/', views.delete_entry, name='delete_entry'),
    path('category/<int:category_id>/', views.category_entries, name='category_entries'),
    path('search/', views.search_results, name='search_results'),
    path('generate/', views.generate_entry, name='generate_entry'),

]