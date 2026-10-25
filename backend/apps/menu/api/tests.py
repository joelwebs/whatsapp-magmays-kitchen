
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from menu.models import Category, FoodItem


class FoodImageUploadTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="kitchen_admin_test",
            password="TestPassword!9284",
            is_staff=True,
        )

        self.category = Category.objects.create(
            name="Test Category",
        )

        self.food = FoodItem.objects.create(
            category=self.category,
            name="Test Food",
            description="Test description",
            price=Decimal("25.00"),
        )

        self.upload_url = "/api/v1/menu/foods/upload-image/"

    def test_unauthenticated_upload_is_rejected(self):
        response = self.client.post(self.upload_url, {})
        self.assertIn(response.status_code, (401, 403))

    @patch("menu.api.views.upload_food_image")
    def test_staff_can_upload_valid_image(self, mock_upload):
        from io import BytesIO
        from PIL import Image
        from django.core.files.uploadedfile import SimpleUploadedFile

        image_buffer = BytesIO()
        Image.new("RGB", (20, 20), color="red").save(
            image_buffer,
            format="JPEG",
        )

        image_file = SimpleUploadedFile(
            "test-food.jpg",
            image_buffer.getvalue(),
            content_type="image/jpeg",
        )

        mock_upload.return_value = (
            "https://ik.imagekit.io/example/test-food.jpg"
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.upload_url,
            {
                "image": image_file,
                "food_item_id": str(self.food.id),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.food.refresh_from_db()
        self.assertEqual(
            self.food.image_url,
            "https://ik.imagekit.io/example/test-food.jpg",
        )
        mock_upload.assert_called_once()

    def test_non_staff_user_cannot_upload(self):
        regular_user = get_user_model().objects.create_user(
            username="regular_user_test",
            password="TestPassword!9284",
            is_staff=False,
        )

        self.client.force_authenticate(user=regular_user)

        response = self.client.post(self.upload_url, {})

        self.assertEqual(response.status_code, 403)
    
    
    def test_oversized_image_is_rejected(self):
        from django.core.files.uploadedfile import SimpleUploadedFile

        self.client.force_authenticate(user=self.user)

        image_file = SimpleUploadedFile(
            "large.jpg",
            b"x" * (5 * 1024 * 1024 + 1),
            content_type="image/jpeg",
        )

        response = self.client.post(
            self.upload_url,
            {
                "image": image_file,
                "food_item_id": str(self.food.id),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("image", response.data)

    def test_unsupported_mime_type_is_rejected(self):
        from django.core.files.uploadedfile import SimpleUploadedFile

        self.client.force_authenticate(user=self.user)

        image_file = SimpleUploadedFile(
            "document.gif",
            b"not an image",
            content_type="image/gif",
        )

        response = self.client.post(
            self.upload_url,
            {
                "image": image_file,
                "food_item_id": str(self.food.id),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("image", response.data)

    def test_nonexistent_food_item_returns_404(self):
        from io import BytesIO
        from PIL import Image
        from django.core.files.uploadedfile import SimpleUploadedFile
        import uuid

        image_buffer = BytesIO()
        Image.new("RGB", (20, 20), color="red").save(
            image_buffer,
            format="JPEG",
        )

        image_file = SimpleUploadedFile(
            "test-food.jpg",
            image_buffer.getvalue(),
            content_type="image/jpeg",
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.upload_url,
            {
                "image": image_file,
                "food_item_id": str(uuid.uuid4()),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 404)
    
    @patch("menu.api.views.upload_food_image")
    def test_imagekit_failure_returns_502(self, mock_upload):
        from io import BytesIO
        from PIL import Image
        from django.core.files.uploadedfile import SimpleUploadedFile

        self.food.image_url = "https://example.com/old-image.jpg"
        self.food.save(update_fields=["image_url"])

        image_buffer = BytesIO()
        Image.new("RGB", (20, 20), color="blue").save(
            image_buffer,
            format="JPEG",
        )

        image_file = SimpleUploadedFile(
            "test-food.jpg",
            image_buffer.getvalue(),
            content_type="image/jpeg",
        )

        mock_upload.side_effect = RuntimeError("Simulated ImageKit failure")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.upload_url,
            {
                "image": image_file,
                "food_item_id": str(self.food.id),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 502)

        self.food.refresh_from_db()
        self.assertEqual(
            self.food.image_url,
            "https://example.com/old-image.jpg",
        )
