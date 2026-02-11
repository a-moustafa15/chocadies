import shutil
import tempfile
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Applicant

# We use a temporary directory for file uploads during tests
# so we don't clutter your actual media folder.
MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ApplicantTests(APITestCase):

    def setUp(self):
        """
        Setup runs before every single test method.
        """
        # 1. Create a User (HR) for authentication tests
        # CRITICAL: Must be is_staff=True to pass IsHRUser permission!
        self.user = User.objects.create_user(
            username='hr_user',
            password='password123',
            is_staff=True
        )

        # 2. URLs (Assuming router is registered as 'applicants')
        self.list_url = reverse('applicant-list')  # /api/applicants/

        # 3. Create a Dummy File (Simulated PDF)
        self.resume_file = SimpleUploadedFile(
            "test_resume.pdf",
            b"This is the content of the PDF file",
            content_type="application/pdf"
        )

        # 4. Create an initial Applicant object directly in DB
        self.applicant = Applicant.objects.create(
            first_name="Existing",
            last_name="User",
            email="existing@example.com",
            resume_file=self.resume_file,
            status="applied",
            cover_letter="Original letter"
        )
        self.detail_url = reverse('applicant-detail', args=[self.applicant.id])

    def tearDown(self):
        """Clean up the temporary media folder after tests"""
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    # --- TEST BLOCK 1: PUBLIC ACCESS (The "Applicant" side) ---

    def test_create_applicant_public_with_file(self):
        """
        Test that an unauthenticated user (Public) can POST a new application
        with a file upload.
        """
        new_resume = SimpleUploadedFile(
            "new_cv.pdf", b"New CV Content", content_type="application/pdf"
        )

        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'resume_file': new_resume,
            'cover_letter': 'I want this job!',
            'status': 'applied'
        }

        # format='multipart' is required for file uploads
        response = self.client.post(self.list_url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Applicant.objects.count(), 2)

        # Verify the file was actually saved
        new_applicant = Applicant.objects.get(email='john.doe@example.com')
        self.assertTrue(new_applicant.resume_file)
        self.assertIn('new_cv', new_applicant.resume_file.name)

    def test_create_applicant_ignores_internal_fields(self):
        """
        SECURITY TEST: Test that if a public user tries to set 'hr_rating'
        or 'status' to 'hired', the API ignores it (Mass Assignment check).
        """
        new_resume = SimpleUploadedFile(
            "hacker_cv.pdf", b"Content", content_type="application/pdf"
        )

        data = {
            'first_name': 'Hacker',
            'last_name': 'Man',
            'email': 'hacker@example.com',
            'resume_file': new_resume,
            # Malicious inputs:
            'status': 'hired',
            'hr_rating': 5,
            'hr_notes': 'I am the boss'
        }

        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Retrieve from DB to check what actually happened
        hacker = Applicant.objects.get(email='hacker@example.com')

        # Status should remain default ('applied'), NOT 'hired'
        self.assertEqual(hacker.status, 'applied')
        # HR fields should be empty/None
        self.assertIsNone(hacker.hr_rating)
        self.assertEqual(hacker.hr_notes, '')

    def test_public_user_cannot_see_list(self):
        """Test that public users CANNOT see the list of applicants"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_public_user_cannot_update(self):
        """Test that public users CANNOT update an applicant"""
        data = {'first_name': 'Hacker'}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- TEST BLOCK 2: HR ACCESS (Authenticated & Staff) ---

    def test_hr_can_list_applicants(self):
        """Test that logged-in HR users can see the list"""
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_hr_can_retrieve_single_applicant(self):
        """Test that HR can view details of one applicant"""
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], "Existing")

    def test_hr_can_update_status(self):
        """Test that HR can update the status (e.g. to 'interview')"""
        self.client.force_authenticate(user=self.user)

        data = {'status': 'interview'}
        response = self.client.patch(self.detail_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify DB update
        self.applicant.refresh_from_db()
        self.assertEqual(self.applicant.status, 'interview')

    def test_hr_can_update_rating_and_notes(self):
        """Test that HR can update the specific internal fields"""
        self.client.force_authenticate(user=self.user)

        data = {
            'hr_rating': 5,
            'hr_notes': 'Excellent candidate'
        }
        response = self.client.patch(self.detail_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.applicant.refresh_from_db()
        self.assertEqual(self.applicant.hr_rating, 5)
        self.assertEqual(self.applicant.hr_notes, 'Excellent candidate')

    def test_hr_can_delete_applicant(self):
        """Test that HR can delete an applicant"""
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Applicant.objects.count(), 0)

    # --- TEST BLOCK 3: VALIDATION ---

    def test_create_applicant_invalid_email(self):
        """Test validation: Invalid email should fail"""
        new_resume = SimpleUploadedFile(
            "cv.pdf", b"Content", content_type="application/pdf"
        )
        data = {
            'first_name': 'Bad',
            'last_name': 'Email',
            'email': 'not-an-email',  # Invalid
            'resume_file': new_resume
        }
        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
