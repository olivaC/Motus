from django.urls import reverse
from django.utils import timezone

from django.test import TestCase
from administrator.forms.uploading_forms import *
from administrator.models import Lesson


class LessonFormTest(TestCase):
    """
    Test suite for a Lesson form.
    """

    def setUp(self):
        pass

    def form_data(self, lesson_name):
        return LessonForm(
            data={
                'lesson_name': lesson_name,
                'creation_time': timezone.now()
            }
        )

    def test_valid_data(self):
        form = self.form_data('test_lesson')
        self.assertTrue(form.is_valid())

    def test_missing_lesson_name(self):
        form = self.form_data('')
        errors = form['lesson_name'].errors.as_data()
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].code, 'required')


class VideoFormSetTest(TestCase):
    """
    Test suite for a Video FormSet
    """

    def setUp(self):
        self.lesson = Lesson(lesson_name="test_lesson", creation_time=timezone.now())
        self.lesson.save()

    def form_data(self, name, link, description):
        return VideoForm(
            data={
                'video_name': name,
                'link': link,
                'description': description,
                'lesson': self.lesson
            }
        )

