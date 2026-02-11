from django.db import models


class Applicant(models.Model):
    """Applicant model represents the Bewerber entity in MongoDB"""

    STATUS_CHOICES = [
        ("beworben", "Beworben"),
        ("geprueft", "Geprüft"),
        ("vorstellungsgespräch", "Vorstellungsgespräch"),
        ("eingestellt", "Eingestellt"),
        ("abgelehnt", "Abgelehnt"),
    ]
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    resume_url = models.URLField(blank=True, null=True)
    resume_file = models.FileField(
        upload_to='resume_files/')

    cover_letter = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='beworben')
    linkedin_profile = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    hr_rating = models.IntegerField(null=True, blank=True,)
    hr_notes = models.TextField(blank=True,)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
