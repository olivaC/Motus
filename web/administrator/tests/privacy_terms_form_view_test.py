from django.test import TestCase
from administrator.forms.uploading_forms import *
from administrator.models import *


class PrivacyTermFormTest(TestCase):
    """
    Test suite for a Privacy terms form.
    """

    def setUp(self):
        pass

    def form_data(self, privacy_data, terms_data):
        return PrivacyTermsForm(
            data={
                'privacy': privacy_data,
                'terms': terms_data
            }
        )

    def test_valid_data(self):
        form = self.form_data('test_privacy', 'test_data')
        self.assertTrue(form.is_valid())

    def test_missing_privacy_name(self):
        form = self.form_data('', 'test_data')
        errors = form['privacy'].errors.as_data()
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].code, 'required')

    def test_missing_terms_name(self):
        form = self.form_data('privacy_data', '')
        errors = form['terms'].errors.as_data()
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].code, 'required')


class RemoveUserViewTest(TestCase):
    """
    This test mimics privacy_terms_view(request) without using any requests.
    """

    @classmethod
    def setUpTestData(cls):
        PrivacyTerms.objects.create(privacy="privacy1", terms="terms1")

    def test_update_privacy(self):
        """
        Tests updating privacy
        :return:
        """

        priv = PrivacyTerms.objects.get(id=1)
        priv.privacy = "new privacy"
        self.assertEqual(priv.privacy, "new privacy")

    def test_update_terms(self):
        """
        Tests updating terms
        :return:
        """

        priv = PrivacyTerms.objects.get(id=1)
        priv.terms = "new terms"
        self.assertEqual(priv.terms, "new terms")
