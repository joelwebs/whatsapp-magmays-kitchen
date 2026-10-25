
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class StaffTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_staff:
            raise AuthenticationFailed(
                "Invalid credentials or insufficient permissions."
            )

        return data
