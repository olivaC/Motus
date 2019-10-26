import base64

from django.template.loader import render_to_string
from django.urls import reverse
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from administrator.models import *
from administrator.utilities.utils import *
from django.utils.html import strip_tags
from motus import settings
from django.utils import timezone


class PrivacyTermsSerializer(serializers.ModelSerializer):
    """
    Serializer for Privacy and Terms
    """

    class Meta:
        model = PrivacyTerms
        fields = (
            'privacy',
            'terms',
        )


class LessonSerializer(serializers.ModelSerializer):
    """
    Serializer for the Lesson
    """

    class Meta:
        model = Lesson
        fields = (
            'lesson_name',
            'creation_time',
            'id',
        )


class VideoSerializer(serializers.ModelSerializer):
    """
    Serializer for a Video
    """

    class Meta:
        model = Video
        fields = (
            'lesson',
            'video_name',
            'link',
            'description',
            'duration',
            'youtube_id',
            'id',
        )
        depth = 1


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer to create a user and profile in parallel.
    """
    username = serializers.CharField(source='user.username')
    password = serializers.CharField(source='user.password')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Profile
        fields = ('hash', 'username', 'password', 'first_name',
                  'last_name',)

    def create(self, validated_data):
        x = validated_data.get('user')
        user = User.objects.create_user(username=x['username'],
                                        email=x['username'],
                                        password=x['password'],
                                        first_name=x['first_name'],
                                        last_name=x['last_name'],
                                        )
        profile = Profile.objects.create(user=user)
        return profile


class ProfessionalSerializer(serializers.ModelSerializer):
    """
    Serializer to create a professional, profile, and user in parallel.
    """
    profile = ProfileSerializer()

    class Meta:
        model = Professional
        fields = (
            'picture_img', 'phone_number', 'therapy_style1', 'therapy_style2', 'creation_time', 'profile',
            'id',)

    def create(self, validated_data):

        user_data = validated_data['profile']['user']
        user = User.objects.create_user(username=user_data['username'],
                                        email=user_data['username'],
                                        password=user_data['password'],
                                        first_name=user_data['first_name'],
                                        last_name=user_data['last_name'],
                                        )
        Token.objects.create(user=user)
        profile = Profile.objects.create(user=user)
        if validated_data.get('therapy_style2'):
            professional = Professional.objects.create(
                profile=profile,
                picture=get_image(validated_data),
                phone_number=validated_data['phone_number'],
                therapy_style1=validated_data['therapy_style1'],
                therapy_style2=validated_data['therapy_style2']
            )
        else:
            professional = Professional.objects.create(
                profile=profile,
                picture=get_image(validated_data),
                phone_number=validated_data['phone_number'],
                therapy_style1=validated_data['therapy_style1'],
            )
        return professional

    def update(self, instance, validated_data):
        user_data = validated_data['profile']['user']
        user = User.objects.get(username=instance.profile.user.username)
        user.username = user_data['username']
        user.email = user_data['username']
        user.first_name = user_data['first_name']
        user.last_name = user_data['last_name']
        user.save()

        instance.phone_number = validated_data['phone_number']
        instance.therapy_style1 = validated_data['therapy_style1']
        instance.picture = get_image(validated_data)
        if validated_data.get('therapy_style2'):
            instance.therapy_style2 = validated_data['therapy_style2']
        instance.save()
        return instance


class ParentSerializer(serializers.ModelSerializer):
    """
    Serializer to create a parent, profile and user in parallel.
    """
    profile = ProfileSerializer()

    class Meta:
        model = Parent
        fields = ('profile', 'picture_img', 'professional', 'health_care_number', 'phone_number',
                  'emergency_phone_number', 'creation_time', 'id')
        depth = 1

    def create(self, validated_data):
        user_data = validated_data['profile']['user']
        prof = self.context['request'].user
        prof2 = prof.profile.professional

        user = User.objects.create_user(username=user_data['username'],
                                        email=user_data['username'],
                                        password=user_data['password'],
                                        first_name=user_data['first_name'],
                                        last_name=user_data['last_name'],
                                        )
        Token.objects.create(user=user)
        profile = Profile.objects.create(user=user)
        parent = Parent.objects.create(
            profile=profile,
            professional=prof2,
            health_care_number=validated_data['health_care_number'],
            phone_number=validated_data['phone_number'],
            emergency_phone_number=validated_data['emergency_phone_number'],
        )

        reset_code = PasswordResetCode.objects.create(user=user, creation_time=timezone.now())
        context = dict(
            domain=settings.DOMAIN,
            url=url_with_params(settings.DOMAIN + reverse("administrator:password_reset"),
                                dict(email=user.email)),
        )
        msg_html = str(render_to_string('password/email.html', context))
        send_password_reset(user.email, strip_tags(msg_html))

        return parent

    def update(self, instance, validated_data):
        user_data = validated_data['profile']['user']
        user = User.objects.get(username=instance.profile.user.username)
        user.username = user_data['username']
        user.email = user_data['username']
        user.first_name = user_data['first_name']
        user.last_name = user_data['last_name']
        user.save()

        instance.health_care_number = validated_data['health_care_number']
        instance.phone_number = validated_data['phone_number']
        instance.emergency_phone_number = validated_data['emergency_phone_number']
        instance.picture = get_image(validated_data)
        instance.save()
        return instance


class ChildSerializer(serializers.ModelSerializer):
    """
    Serializer
    to
    create
    a
    parent, child, parent
    profile and parent
    user in parallel.
    """
    parent = ParentSerializer(read_only=True)

    class Meta:
        model = Child
        fields = (
            'id', 'is_active', 'first_name', 'last_name', 'age', 'picture_img', 'professional', 'parent',
            'creation_time', 'last_login_time')
        depth = 1

    def create(self, validated_data):
        prof = self.context['request'].user
        prof2 = prof.profile.professional

        par_id = int(self.context['request'].data.get('parent'))
        parent = Parent.objects.filter(id=par_id).first()

        child = Child.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            age=validated_data['age'],
            is_active=True,
            parent=parent,
            professional=prof2,
        )
        return child

    def update(self, instance, validated_data):
        x = validated_data.get('picture_img')
        if x:
            instance.picture = get_image(validated_data)
        else:
            instance.last_login_time = timezone.now()
        instance.save()
        return instance


class SupportTeamSerializer(serializers.ModelSerializer):
    """
    Serializer
    for Privacy and Terms
        """

    class Meta:
        model = Support
        fields = (
            'name',
            'position',
            'phone',
            'email',
            'picture',
            'id',
        )


class ResourceSerializer(serializers.ModelSerializer):
    """
Serializer
for Resources
    """

    class Meta:
        model = Resource
        fields = (
            'name',
            'pdf_file',
            'picture',
            'teaser',
            'resource_type',
            'active',
            'id'
        )


class AppointmentSerializer(serializers.ModelSerializer):
    """
Serializer
for Appointment
    """

    parent = ParentSerializer(read_only=True, required=False)

    class Meta:
        model = Appointment
        fields = (
            'professional',
            'date',
            'start_time',
            'end_time',
            'parent',
            'id',
            'booked',
        )

    def update(self, instance, validated_data):
        req = validated_data['booked']
        _user = self.context['request'].user
        par_bool = False
        try:
            if_par = _user.profile.parent
            request = self.context.get('request')
            r = request.data.get('todo')
            if r == 'cancel':
                instance.parent = None
                instance.save()
                return instance
            par_bool = True
        except:
            par_bool = False

        # Professional canceling appointments
        request = self.context.get('request')
        r = request.data.get('todo')
        if r == 'prof_cancel':
            parent_appointment_notification(instance.parent, instance.professional, instance, 'CANCELED')
            instance.parent = None
            instance.booked = False
            instance.save()
            return instance

        if par_bool:
            instance.parent = _user.profile.parent
            professional_appointment_notification(instance.professional, instance.parent, instance)
        elif req:
            instance.booked = validated_data['booked']
            parent_appointment_notification(instance.parent, instance.professional, instance, 'ACCEPTED')
        else:
            parent_appointment_notification(instance.parent, instance.professional, instance, 'DECLINED')
            instance.parent = None
        instance.save()
        return instance


class AssignedLessonPostSerializer(serializers.ModelSerializer):
    """
    Serializer for an assigned lesson.
    """
    child = ChildSerializer(read_only=True)
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = AssignedLesson
        fields = (
            'child',
            'lesson',
            'completed',
            'id',
        )

    def create(self, validated_data):
        request = self.context.get('request')
        r = request.data
        c_id = r.get('_parts')[0][1].get('id')
        l_id = r.get('_parts')[1][1].get('id')

        chi = Child.objects.all()
        less = Lesson.objects.all()

        _child = chi.filter(id=c_id).first()
        _lesson = less.filter(id=l_id).first()

        assigned_lesson = AssignedLesson.objects.create(
            child=_child,
            lesson=_lesson
        )

        videos = Video.objects.all()
        queryset = videos.filter(lesson=_lesson)

        for i in queryset:
            AssignedVideos.objects.create(
                assigned_lesson=assigned_lesson,
                child=_child,
                video=i,
            )

        # Send parent a notification about an assigned lesson
        parent_new_lesson_notification(_child.parent, _child, _lesson)

        return assigned_lesson


class AssignedVideosSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    video = VideoSerializer(read_only=True)

    class Meta:
        model = AssignedVideos
        fields = (
            'id',
            'bookmark',
            'assigned_lesson',
            'child',
            'video',
            'reaction',
            'date_completed',
            'watched',
            'react',
            'reaction_date',
            'diary_entry',
            'diary_entry_date',
            'bookmark_date',

        )

    def update(self, instance, validated_data):
        request = self.context.get('request')
        r = request.data
        new_bookmark = r.get('_parts')[2][1]
        if new_bookmark == 'false':
            instance.bookmark = False
            instance.bookmark_date = None
        else:
            instance.bookmark = True
            instance.bookmark_date = timezone.now()
        instance.save()
        return instance


class AssignedVideosDiarySerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    video = VideoSerializer(read_only=True)

    class Meta:
        model = AssignedVideos
        fields = (
            'id',
            'bookmark',
            'assigned_lesson',
            'child',
            'video',
            'reaction',
            'date_completed',
            'watched',
            'react',
            'reaction_date',
            'diary_entry',
            'diary_entry_date',
            'bookmark_date',
        )

    def update(self, instance, validated_data):
        request = self.context.get('request')
        r = request.data
        react = r.get('_parts')[0][1]
        instance.diary_entry = react
        instance.diary_entry_date = timezone.now()
        instance.diary = True
        instance.save()
        return instance


class AssignedVideosReactionSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    video = VideoSerializer(read_only=True)

    class Meta:
        model = AssignedVideos
        fields = (
            'id',
            'bookmark',
            'assigned_lesson',
            'child',
            'video',
            'reaction',
            'date_completed',
            'watched',
        )

    def update(self, instance, validated_data):
        request = self.context.get('request')
        r = request.data
        react = r.get('_parts')[2][1]
        instance.reaction = react
        instance.react = True
        instance.reaction_date = timezone.now()
        instance.save()
        return instance


class AssignedVideosTimeSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    video = VideoSerializer(read_only=True)

    class Meta:
        model = AssignedVideos
        fields = (
            'id',
            'bookmark',
            'assigned_lesson',
            'child',
            'video',
            'reaction',
            'date_completed',
            'watched',
        )

    def update(self, instance, validated_data):
        request = self.context.get('request')
        r = request.data
        c_id = r.get('_parts')[0][1]
        l_id = r.get('_parts')[1][1]
        instance.date_completed = timezone.now()
        instance.watched = True
        instance.save()

        less = AssignedLesson.objects.all().filter(id=int(l_id)).first()
        all_vids = AssignedVideos.objects.all().filter(assigned_lesson=less)
        watched_vids = all_vids.filter(watched=True)
        all_vid_len = len(all_vids)
        watched_vid_len = len(watched_vids)

        if all_vid_len == watched_vid_len:
            less.completed = True
            less.save()

        return instance


class ContactProfessionalSerializer(serializers.ModelSerializer):
    professional = ProfessionalSerializer(read_only=True, required=False)
    parent = ParentSerializer(read_only=True, required=False)

    class Meta:
        model = ContactProfessional
        fields = (
            'professional',
            'parent',
            'message'
        )

    def create(self, validated_data):
        par = self.context['request'].user
        parent = par.profile.parent
        parent_email = par.email
        professional = parent.professional
        professional_email = professional.profile.user.email

        message = ContactProfessional.objects.create(
            professional=professional,
            parent=parent,
            message=validated_data['message'],
        )

        send_professional_message(parent_email, parent.profile.full_name, professional_email, validated_data['message'])

        return message


class ContactSupportSerializer(serializers.ModelSerializer):
    professional = ProfessionalSerializer(read_only=True, required=False)

    class Meta:
        model = ContactSupport
        fields = (
            'professional',
            'message'
        )

    def create(self, validated_data):
        prof = self.context['request'].user
        pf = prof.profile.professional
        profes_email = prof.email

        support = SupportEmail.objects.last()
        support_email = support.email

        request = self.context.get('request')
        r = request.data
        message_str = r.get('_parts')[0][1]

        message = ContactSupport.objects.create(
            professional=pf,
            message=message_str,
        )

        send_support_message(support_email, prof.profile.full_name, profes_email, message_str)

        return message
