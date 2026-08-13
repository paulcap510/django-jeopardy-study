from rest_framework.test import APITestCase
from django.test import override_settings
from .models import Entry


@override_settings(ADMIN_SECRET_KEY="test-key-value")
class AdminKeyProtectionTests(APITestCase):
    def test_write_without_key_is_rejected(self):
        entry = Entry.objects.create(name="Test Entry", content="Some content")
        response = self.client.delete(
            f"/api/entries/{entry.id}/delete/"
        )  # * allows to simulate a delete of the URL we give it
        self.assertEqual(
            response.status_code, 401
        )  # * checks the status code on response in 401
        self.assertTrue(
            Entry.objects.filter(id=entry.id).exists()
        )  # * checks whether entry exists in the db
        # * after test runs , entry should still be in the DB

    def test_write_with_wrong_key_is_rejected(self):
        entry = Entry.objects.create(name="Test Entry", content="Some content")
        response = self.client.delete(
            f"/api/entries/{entry.id}/delete/", HTTP_X_ADMIN_KEY="wrong-value"
        )
        self.assertEqual(response.status_code, 401)
        self.assertTrue(Entry.objects.filter(id=entry.id).exists())
        # * this tests the same DELETE but with the wrong value sent in header

    def test_write_with_correct_key_succeeds(self):
        entry = Entry.objects.create(name="Test Entry", content="Some content")
        response = self.client.delete(
            f"/api/entries/{entry.id}/delete/", HTTP_X_ADMIN_KEY="test-key-value"
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Entry.objects.filter(id=entry.id).exists())
        # * this one should delete the entry because the headers match
