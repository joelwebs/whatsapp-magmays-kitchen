
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from config.auth_serializers import StaffTokenObtainPairSerializer


class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/v1/auth/login/",
        StaffTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/v1/auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path("api/v1/menu/", include("menu.api.urls")),
    path("api/v1/business/", include("core.urls")),
]
