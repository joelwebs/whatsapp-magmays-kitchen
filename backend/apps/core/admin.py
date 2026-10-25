from django.contrib import admin
from .models import Business, DeliveryLocation

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("name", "whatsapp_number", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "whatsapp_number")


@admin.register(DeliveryLocation)
class DeliveryLocationAdmin(admin.ModelAdmin):
    list_display = ("name", "delivery_fee", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
