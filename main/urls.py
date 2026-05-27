from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('events/', views.events, name='events'),
    path('contact/', views.contact, name='contact'),
    path('event/<int:id>/', views.event_detail, name='event_detail'),
    path('delete-event/<int:id>/', views.delete_event, name='delete_event'),
    path('edit-event/<int:id>/', views.edit_event, name='edit_event'),
    path('delete-media/<int:id>/', views.delete_media, name='delete_media'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('delete-media/<int:id>/', views.delete_media, name='delete_media'),
]
