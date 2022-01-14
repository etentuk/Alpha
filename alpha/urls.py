"""alpha URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView
from django.views.generic import TemplateView, RedirectView
from bugtracker.api.views import MyPasswordChangeView
from django.contrib.staticfiles.storage import staticfiles_storage



urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),

    path('admin/', admin.site.urls),

    path('dj-rest-auth/password/reset/', PasswordResetView.as_view(), name="rest_password_reset"),

    path('dj-rest-auth/password/reset/confirm/<uidb64>/<token>/', PasswordResetView.as_view(),
         name="password_reset_confirm"),
    path(
        "dj-rest-auth/password/reset/confirm/",
        PasswordResetConfirmView.as_view(), name="rest_password_reset_confirm",),


    path('dj-rest-auth/password/change/', MyPasswordChangeView.as_view(), name='password_change_view'),

    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('bugtracker.api.urls')),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('/favicon.ico'))),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]
