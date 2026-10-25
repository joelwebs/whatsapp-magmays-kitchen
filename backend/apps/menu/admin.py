from django.contrib import admin
from .models import Category, FoodItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("display_order", "name")


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "is_available",
        "display_order",
    )
    list_filter = ("category", "is_available")
    search_fields = ("name", "description")
    ordering = ("display_order", "name")
