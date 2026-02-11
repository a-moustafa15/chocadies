from django.contrib import admin

from applicants.models import Applicant


@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    pass
