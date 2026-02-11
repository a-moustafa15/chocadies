from rest_framework import viewsets
from applicants.models import Applicant
from applicants.serializers import PublicApplicantSerializer, HRApplicantSerializer
from core.permissions import IsHRUser
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class ApplicantViewSet(viewsets.ModelViewSet):
    """API endpoint for applicants.
    GET/PUT/DELETE require authentication (HR).
    POST is public (for applicants).
    """
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action == 'create':  # POST
            permission_classes = [AllowAny]
        else:
            # GET, PUT, PATCH, DELETE
            permission_classes = [IsHRUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Public users shouldn't see the list of applicants"""
        user = self.request.user
        if user and (user.is_superuser or user.is_staff):
            return Applicant.objects.all().order_by('-created_at')
        # Return empty list for public
        return Applicant.objects.none()

    def get_serializer_class(self):
        """Dynamic Serializer Selection"""
        # If the user is HR (Authenticated), give them the full serializer
        user = self.request.user
        if user and (user.is_superuser or user.is_staff):
            return HRApplicantSerializer

        # If the user is a guest (Applicant), give them the restricted serializer
        return PublicApplicantSerializer
