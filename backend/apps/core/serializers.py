
from rest_framework import serializers

from core.models import Business, DeliveryLocation


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            "id",
            "name",
            "whatsapp_number",
            "phone_number",
            "address",
            "currency",
        ]


class DeliveryLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryLocation
        fields = [
            "id",
            "name",
            "delivery_fee",
        ]
