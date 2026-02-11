from django.urls import path, include
from rest_framework.routers import DefaultRouter
from applicants.views import ApplicantViewSet

router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet, basename='applicant')

urlpatterns = [
    path('', include(router.urls)),
]
