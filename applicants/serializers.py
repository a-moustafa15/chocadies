from rest_framework import serializers
from applicants.models import Applicant


class PublicApplicantSerializer(serializers.ModelSerializer):
    """ Serializer for Applicants (Public)
    They can ONLY write their personal data.
    """
    id = serializers.CharField(source='pk', read_only=True)

    class Meta:
        model = Applicant
        exclude = ('hr_rating', 'hr_notes', 'status')


class HRApplicantSerializer(serializers.ModelSerializer):
    """Serializer for HR (Internal)
    They can see and edit EVERYTHING
    """
    id = serializers.CharField(source='pk', read_only=True)

    class Meta:
        model = Applicant
        fields = '__all__'
