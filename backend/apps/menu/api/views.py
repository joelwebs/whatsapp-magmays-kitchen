
import logging
from pathlib import Path

from PIL import Image, UnidentifiedImageError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from menu.models import Category, FoodItem
from menu.api.serializers import (
    CategorySerializer,
    FoodItemSerializer,
    FoodImageUploadSerializer,
)
from menu.imagekit_service import upload_food_image

logger = logging.getLogger(__name__)


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


class FoodImageUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = FoodImageUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_image = serializer.validated_data["image"]
        food_item_id = serializer.validated_data["food_item_id"]

        # Verify the actual image content, not just the supplied MIME type.
        try:
            uploaded_image.seek(0)
            with Image.open(uploaded_image) as image:
                if image.format not in {"JPEG", "PNG", "WEBP"}:
                    return Response(
                        {"image": "Only JPEG, PNG, and WebP images are allowed."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                image.verify()
            uploaded_image.seek(0)
        except (UnidentifiedImageError, OSError, ValueError):
            return Response(
                {"image": "The uploaded file is not a valid image."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        food_item = get_object_or_404(FoodItem, id=food_item_id)

        safe_filename = Path(uploaded_image.name).name

        try:
            image_url = upload_food_image(
                uploaded_image,
                safe_filename,
            )
        except Exception:
            logger.exception(
                "ImageKit upload failed for food item %s",
                food_item.id,
            )
            return Response(
                {"detail": "Image upload failed. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        food_item.image_url = image_url
        food_item.save(update_fields=["image_url", "updated_at"])

        return Response(
            {
                "food_item_id": str(food_item.id),
                "image_url": food_item.image_url,
            },
            status=status.HTTP_200_OK,
        )
