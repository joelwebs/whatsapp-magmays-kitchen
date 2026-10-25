
from django.urls import path

from core.views import (
    PublicBusinessView,
    PublicDeliveryLocationListView,
)

urlpatterns = [
    path("", PublicBusinessView.as_view(), name="public-business"),
    path(
        "delivery-locations/",
        PublicDeliveryLocationListView.as_view(),
        name="public-delivery-locations",
    ),
]

