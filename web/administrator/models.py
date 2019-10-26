import os

from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from administrator.utilities.utils import hash_generator, profile_default_image


# Will take out for sprint 3
def get_professional_picture_path(instance, filename=None):
    _, file_ext = os.path.splitext(filename)
    return os.path.join('users', 'professional', instance.profile.hash, "profile_picture" + file_ext)


def get_parent_picture_path(instance, filename=None):
    _, file_ext = os.path.splitext(filename)
    return os.path.join('users', 'parent', instance.profile.hash, "profile_picture" + file_ext)


def get_child_picture_path(instance, filename=None):
    _, file_ext = os.path.splitext(filename)
    return os.path.join('users', 'child', instance.hash, "profile_picture" + file_ext)


def get_pdf_file_path(instance, filename=None):
    _, file_ext = os.path.splitext(filename)
    return os.path.join('pdf', 'professional', _ + file_ext)


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    hash = models.CharField(max_length=30, unique=True, blank=True)

    @property
    def full_name(self):
        return self.user.get_full_name()

    def save(self, *args, **kwargs):
        if not self.hash:
            self.hash = hash_generator(self.__class__, 30)
        super(self.__class__, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.user)


THERAPY_STYLES = (

    ('Cognitive Behavioural Therapy', 'Cognitive Behavioural Therapy'),
    ('Emotion-focused Therapy', 'Emotion-focused Therapy'),
    ('Integrative Therapy', 'Integrative Therapy'),
    ('Mindfulness-based Therapy', 'Mindfulness-based Therapy'),
    ('Play Therapy', 'Play Therapy'),
    ('Psychodynamic Therapy', 'Psychodynamic Therapy'),
    ('Interpersonal Therapy', 'Interpersonal Therapy'),

)


class Professional(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True)
    picture = models.TextField(null=True, blank=True)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')
    phone_number = models.CharField(max_length=15)
    therapy_style1 = models.CharField(max_length=100, choices=THERAPY_STYLES)
    therapy_style2 = models.CharField(max_length=100, choices=THERAPY_STYLES, null=True, blank=True)  # Optional
    creation_time = models.DateTimeField(default=timezone.now)
    last_login_time = models.DateTimeField(null=True, blank=True)
    skin = models.CharField(max_length=100, null=True, blank=True)  # Not MVP
    font_size = models.IntegerField(null=True, blank=True)  # Not MVP

    def __str__(self):
        return str(self.profile.full_name)


class Parent(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True)
    picture = models.TextField(null=True, blank=True, default=profile_default_image)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')
    professional = models.ForeignKey(Professional, related_name="parent", on_delete=models.DO_NOTHING)
    health_care_number = models.IntegerField()
    phone_number = models.CharField(max_length=15)
    emergency_phone_number = models.CharField(max_length=15)
    creation_time = models.DateTimeField(default=timezone.now)
    last_login_time = models.DateTimeField(null=True, blank=True)
    skin = models.CharField(max_length=100, null=True, blank=True)  # Not MVP
    font_size = models.IntegerField(null=True, blank=True)  # Not MVP

    def __str__(self):
        return str(self.profile.full_name)


class Child(models.Model):
    is_active = models.BooleanField(default=True, blank=True)
    hash = models.CharField(max_length=30, unique=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    picture = models.TextField(null=True, blank=True, default=profile_default_image)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')
    professional = models.ForeignKey(Professional, on_delete=models.DO_NOTHING)
    parent = models.ForeignKey(Parent, related_name="child", on_delete=models.CASCADE)
    creation_time = models.DateTimeField(default=timezone.now)
    last_login_time = models.DateTimeField(null=True, blank=True)
    skin = models.CharField(max_length=100, null=True, blank=True)  # Not MVP
    font_size = models.IntegerField(null=True, blank=True)  # Not MVP

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)

    def save(self, *args, **kwargs):
        if not self.hash:
            self.hash = hash_generator(self.__class__, 30)
        super(self.__class__, self).save(*args, **kwargs)

    def get_parent(self):
        return self.parent

    def get_professional(self):
        return self.professional

    def get_id(self):
        return self.id


class Lesson(models.Model):
    lesson_name = models.CharField(max_length=100, unique=True)
    creation_time = models.DateTimeField()
    picture = models.TextField(null=True, blank=True, default=profile_default_image)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')

    def __str__(self):
        return "{}".format(self.lesson_name)


class AssignedLesson(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {} - {}".format(self.lesson.lesson_name, self.child.id, self.completed)


class Video(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    video_name = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.CharField(max_length=15, null=True, blank=True)
    youtube_id = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return "{} - {}".format(self.lesson, self.video_name)


class AssignedVideos(models.Model):
    assigned_lesson = models.ForeignKey(AssignedLesson, on_delete=models.CASCADE)
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    time_watched = models.IntegerField(null=True, blank=True)
    date_completed = models.DateTimeField(null=True, blank=True)
    reaction_date = models.DateTimeField(null=True, blank=True)
    reaction = models.CharField(max_length=15, null=True, blank=True)
    bookmark = models.BooleanField(default=False)
    watched = models.BooleanField(default=False)
    react = models.BooleanField(default=False)
    diary_entry = models.TextField(blank=True)
    diary = models.BooleanField(default=False)
    diary_entry_date = models.DateTimeField(null=True, blank=True)
    bookmark_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "{} - {}".format(self.child.first_name, self.video.video_name)


class PrivacyTerms(models.Model):
    privacy = models.TextField(default="privacy")
    terms = models.TextField(default="terms and conditions")


RESOURCE_TYPE = (
    ('Academic', 'Academic'),
    ('Parental', 'Parental'),
)


class Resource(models.Model):
    name = models.CharField(max_length=100)
    pdf_file = models.FileField(upload_to=get_pdf_file_path)
    teaser = models.TextField(null=True, blank=True)
    picture = models.TextField(null=True, blank=True, default=profile_default_image)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')
    resource_type = models.CharField(max_length=100, choices=RESOURCE_TYPE)
    active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)


class Support(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.CharField(max_length=100)
    picture = models.TextField(null=True, blank=True, default=profile_default_image)
    picture_img = models.ImageField(null=True, blank=True, upload_to='picture')

    def __str__(self):
        return str(self.name)


class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=120)
    creation_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.hash = hash_generator(self.__class__, 30)
        super(self.__class__, self).save(*args, **kwargs)

    def __str__(self):
        return u'%s - %s' % (self.user.email, self.code)


class Appointment(models.Model):
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    date = models.DateField(null=False)
    start_time = models.CharField(max_length=10)
    end_time = models.CharField(max_length=10)
    booked = models.BooleanField(default=False, null=False)
    parent = models.ForeignKey(Parent, related_name='appointment_assigned', blank=True, null=True,
                               on_delete=models.DO_NOTHING)

    def __str__(self):
        return "{} {} : {} - {}".format(self.professional, self.date, self.start_time,
                                        self.end_time, )

    def get_professional(self):
        return self.professional


class ContactProfessional(models.Model):
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{} - {}".format(self.parent.profile.full_name, self.professional.profile.full_name)


class SupportEmail(models.Model):
    email = models.CharField(max_length=100, default='motus401@gmail.com')

    def __str__(self):
        return str(self.email)


class ContactSupport(models.Model):
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{}".format(self.professional.profile.full_name)
