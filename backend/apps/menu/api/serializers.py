from rest_framework import serializers

from menu.models import Category, FoodItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "display_order",
        ]


class FoodItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = FoodItem
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "image_url",
            "is_available",
            "display_order",
        ]


class FoodImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    food_item_id = serializers.UUIDField()

    def validate_image(self, image):
        max_size = 5 * 1024 * 1024  # 5 MB

        if image.size > max_size:
            raise serializers.ValidationError(
                "Image size must not exceed 5 MB."
            )

        allowed_types = {"image/jpeg", "image/png", "image/webp"}
        content_type = getattr(image, "content_type", None)

        if content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPG, PNG, and WebP images are allowed."
            )

        return image
