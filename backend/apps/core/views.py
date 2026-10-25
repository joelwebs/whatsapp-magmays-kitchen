

from rest_framework import generics
from rest_framework.permissions import AllowAny

from core.models import Business, DeliveryLocation
from core.serializers import (
    BusinessSerializer,
    DeliveryLocationSerializer,
)


class PublicBusinessView(generics.RetrieveAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Business.objects.filter(is_active=True).first()


class PublicDeliveryLocationListView(generics.ListAPIView):
    serializer_class = DeliveryLocationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DeliveryLocation.objects.filter(
            is_active=True
        ).order_by("name")


