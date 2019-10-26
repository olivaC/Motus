from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone

# Model tests
from administrator.models import Lesson, Video, Professional, Profile, Parent, Child, PrivacyTerms


class ProfessionalModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(username='testuser1', password='12345', first_name="one", last_name="test")
        profile = Profile.objects.create(user=user)
        Professional.objects.create(profile=profile, creation_time=timezone.now(), picture="picture",
                                    phone_number=123456, therapy_style1="therapy_style")

    def test_professional_create(self):
        professional = Professional.objects.get(id=1)
        self.assertEqual("one test", professional.profile.user.get_full_name())

    def test_professional_name_str_method(self):
        professional = Professional.objects.get(id=1)
        self.assertEqual(professional.__str__(), professional.profile.full_name)

    def test_picture_label(self):
        professional = Professional.objects.get(id=1)
        field_label = professional._meta.get_field('picture').verbose_name
        self.assertEquals(field_label, 'picture')

    def test_phone_number_label(self):
        professional = Professional.objects.get(id=1)
        field_label = professional._meta.get_field('phone_number').verbose_name
        self.assertEquals(field_label, 'phone number')

    def test_therapy_style_label(self):
        professional = Professional.objects.get(id=1)
        field_label = professional._meta.get_field('therapy_style1').verbose_name
        self.assertEquals(field_label, 'therapy style1')

    def test_creation_time_label(self):
        professional = Professional.objects.get(id=1)
        field_label = professional._meta.get_field('creation_time').verbose_name
        self.assertEquals(field_label, 'creation time')


class LessonModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(username='testuser', password='12345')
        Lesson.objects.create(lesson_name="test_lesson", creation_time=timezone.now())

    def test_lesson_name_label(self):
        lesson = Lesson.objects.get(id=1)
        field_label = lesson._meta.get_field('lesson_name').verbose_name
        self.assertEquals(field_label, 'lesson name')

    def test_creation_time_label(self):
        lesson = Lesson.objects.get(id=1)
        field_label = lesson._meta.get_field('creation_time').verbose_name
        self.assertEquals(field_label, 'creation time')

    def test_lesson_name_max_length(self):
        lesson = Lesson.objects.get(id=1)
        max_length = lesson._meta.get_field('lesson_name').max_length
        self.assertEquals(max_length, 100)

    def test_lesson_name_str_method(self):
        lesson = Lesson.objects.get(id=1)
        self.assertEqual(lesson.__str__(), lesson.lesson_name)


class VideoModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        Lesson.objects.create(lesson_name="test_lesson_2", creation_time=timezone.now())
        lesson = Lesson.objects.get(id=1)
        Video.objects.create(lesson=lesson, video_name="name", link="link", description="description")

    def test_video_create(self):
        video = Video.objects.get(id=1)
        self.assertTrue(isinstance(video, Video))

    def test_video_name_label(self):
        video = Video.objects.get(id=1)
        field_label = video._meta.get_field('video_name').verbose_name
        self.assertEquals(field_label, 'video name')

    def test_video_link_label(self):
        video = Video.objects.get(id=1)
        field_label = video._meta.get_field('link').verbose_name
        self.assertEquals(field_label, 'link')

    def test_video_description_label(self):
        video = Video.objects.get(id=1)
        field_label = video._meta.get_field('description').verbose_name
        self.assertEquals(field_label, 'description')

    def test_video_lesson_label(self):
        video = Video.objects.get(id=1)
        field_label = video._meta.get_field('lesson').verbose_name
        self.assertEquals(field_label, 'lesson')

    def test_video_name_max_length(self):
        video = Video.objects.get(id=1)
        max_length = video._meta.get_field('video_name').max_length
        self.assertEquals(max_length, 100)

    def test_link_max_length(self):
        video = Video.objects.get(id=1)
        max_length = video._meta.get_field('link').max_length
        self.assertEquals(max_length, 100)

    def test_video_name_str_method(self):
        video = Video.objects.get(id=1)
        title = "{} - {}".format(video.lesson.lesson_name, video.video_name)
        self.assertEqual(video.__str__(), title)

    def test_video_name(self):
        video = Video.objects.get(id=1)
        self.assertEqual("name", video.video_name)


class ChildModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user1 = User.objects.create_user(username='testuser1', password='12345', first_name="one", last_name="test")
        user2 = User.objects.create_user(username='testuser2', password='12345', first_name="two", last_name="test")
        profile1 = Profile.objects.create(user=user1)
        profile2 = Profile.objects.create(user=user2)
        professional = Professional.objects.create(profile=profile1, picture="test", phone_number=123456789,
                                                   therapy_style1="style",
                                                   creation_time=timezone.now())
        parent = Parent.objects.create(profile=profile2, picture="test", professional=professional,
                                       health_care_number=123456, phone_number=123456789,
                                       emergency_phone_number=123456789, creation_time=timezone.now())
        Child.objects.create(first_name="three", last_name="test", age=4, picture="test", professional=professional,
                             parent=parent, creation_time=timezone.now())

    def test_child_create(self):
        child = Child.objects.get(id=1)
        self.assertEqual("three test", child.__str__())

    def test_child_first_name_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('first_name').verbose_name
        self.assertEquals(field_label, 'first name')

    def test_child_last_name_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('last_name').verbose_name
        self.assertEquals(field_label, 'last name')

    def test_child_age_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('age').verbose_name
        self.assertEquals(field_label, 'age')

    def test_child_picture_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('picture').verbose_name
        self.assertEquals(field_label, 'picture')

    def test_child_professional_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('professional').verbose_name
        self.assertEquals(field_label, 'professional')

    def test_child_parent_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('parent').verbose_name
        self.assertEquals(field_label, 'parent')

    def test_child_creation_time_label(self):
        child = Child.objects.get(id=1)
        field_label = child._meta.get_field('creation_time').verbose_name
        self.assertEquals(field_label, 'creation time')

    def test_child_picture(self):
        child = Child.objects.get(id=1)
        self.assertEqual("test", child.picture)

    def test_child_parent_function(self):
        child = Child.objects.get(id=1)
        self.assertEqual(child.parent, child.get_parent())

    def test_child_professional_function(self):
        child = Child.objects.get(id=1)
        self.assertEqual(child.professional, child.get_professional())

    def test_child_age(self):
        child = Child.objects.get(id=1)
        self.assertNotEquals(child.age, 5)
        self.assertEqual(child.age, 4)

    def test_child_first_name(self):
        child = Child.objects.get(id=1)
        self.assertNotEquals(child.first_name, "testing")
        self.assertEqual(child.first_name, "three")

    def test_child_last_name(self):
        child = Child.objects.get(id=1)
        self.assertNotEquals(child.last_name, "testing")
        self.assertEqual(child.last_name, "test")


class PrivacyTermsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        PrivacyTerms.objects.create(privacy="privacy1", terms="terms1")

    def test_privacy_name_label(self):
        privacy = PrivacyTerms.objects.get(id=1)
        field_label = privacy._meta.get_field('privacy').verbose_name
        self.assertEquals(field_label, 'privacy')

    def test_terms_name_label(self):
        privacy = PrivacyTerms.objects.get(id=1)
        field_label = privacy._meta.get_field('terms').verbose_name
        self.assertEquals(field_label, 'terms')

    def test_privacy_name(self):
        privacy = PrivacyTerms.objects.get(id=1)
        self.assertEqual(privacy.privacy, "privacy1")

    def test_terms_name(self):
        privacy = PrivacyTerms.objects.get(id=1)
        self.assertEqual(privacy.terms, "terms1")
