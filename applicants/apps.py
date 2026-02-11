from django.apps import AppConfig


class ApplicantsConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.fields.ObjectIdAutoField'
    name = 'applicants'
