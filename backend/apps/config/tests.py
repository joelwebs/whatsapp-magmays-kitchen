from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class StaffAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()

        self.staff_user = User.objects.create_user(
            username="staff_auth_test",
            password="StrongTestPass!123",
            is_staff=True,
        )

        self.regular_user = User.objects.create_user(
            username="regular_auth_test",
            password="StrongTestPass!123",
            is_staff=False,
        )

        self.login_url = "/api/v1/auth/login/"
        self.refresh_url = "/api/v1/auth/refresh/"

    def test_staff_can_obtain_tokens(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "staff_auth_test",
                "password": "StrongTestPass!123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_non_staff_cannot_obtain_tokens(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "regular_auth_test",
                "password": "StrongTestPass!123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 401)

    def test_invalid_password_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "staff_auth_test",
                "password": "WrongPassword!123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 401)

    def test_valid_refresh_token_returns_access_token(self):
        login_response = self.client.post(
            self.login_url,
            {
                "username": "staff_auth_test",
                "password": "StrongTestPass!123",
            },
            format="json",
        )

        self.assertEqual(login_response.status_code, 200)

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": login_response.data["refresh"]},
            format="json",
        )

        self.assertEqual(refresh_response.status_code, 200)
        self.assertIn("access", refresh_response.data)
