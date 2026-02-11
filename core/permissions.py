# applicants/permissions.py
from rest_framework import permissions


class IsHRUser(permissions.BasePermission):
    """Custom permission to only allow superusers or staff to edit."""

    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_superuser or request.user.is_staff))
