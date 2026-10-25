
from rest_framework import generics
from rest_framework.permissions import AllowAny

from menu.models import Category, FoodItem
from menu.api.serializers import CategorySerializer, FoodItemSerializer


class PublicCategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.filter(
            is_active=True
        ).order_by("display_order", "name")


class PublicFoodListView(generics.ListAPIView):
    serializer_class = FoodItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return FoodItem.objects.filter(
            is_available=True,
            category__is_active=True,
        ).select_related("category").order_by(
            "display_order", "name"
        )
