# users/views.py (or wherever your auth views are)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    """logout a user by blacklist the refreshtoken"""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]

            # Blacklist it
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
