from rest_framework import viewsets
from administrator.serializers import *
from django.db.models import Q
from datetime import datetime


class LessonView(viewsets.ModelViewSet):
    """
    The api view to retrieve Lessons.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    allowed_methods = ['GET']


class VideoView(viewsets.ModelViewSet):
    """
    The api view to retrieve videos.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    allowed_methods = ['GET']


class AssignedVideosViewSet(viewsets.ModelViewSet):
    """
    The api view to view assigned lessons.
    """
    serializer_class = AssignedVideosSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()

        _child = self.request.query_params.get('child')
        _lesson = self.request.query_params.get('lesson')

        if user.is_staff:
            return queryset
        elif _child:
            less = AssignedLesson.objects.all().filter(id=int(_lesson)).first()
            # q = queryset.filter(child_id=int(_child)).filter(lesson_id=int(_lesson)).order_by('video_id')
            q = queryset.filter(child_id=int(_child))
            q = q.filter(assigned_lesson=less).order_by('id')

        else:
            return None

        return q


class AssignedVideosTimeViewSet(viewsets.ModelViewSet):
    """
    The api view to view assigned lessons.
    """
    serializer_class = AssignedVideosTimeSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()

        _child = self.request.query_params.get('child')
        _lesson = self.request.query_params.get('lesson')

        if user.is_staff:
            return queryset
        elif _child:
            less = AssignedLesson.objects.all().filter(id=int(_lesson)).first()
            # q = queryset.filter(child_id=int(_child)).filter(lesson_id=int(_lesson)).order_by('video_id')
            q = queryset.filter(child_id=int(_child))
            q = q.filter(assigned_lesson=less)

        else:
            return None

        return q


class AssignedVideosReactionViewSet(viewsets.ModelViewSet):
    """
    The api view to view assigned lessons.
    """
    serializer_class = AssignedVideosReactionSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()

        _child = self.request.query_params.get('child')
        _lesson = self.request.query_params.get('lesson')

        if user.is_staff:
            return queryset
        elif _child:
            less = AssignedLesson.objects.all().filter(id=int(_lesson)).first()
            # q = queryset.filter(child_id=int(_child)).filter(lesson_id=int(_lesson)).order_by('video_id')
            q = queryset.filter(child_id=int(_child))
            q = q.filter(assigned_lesson=less)

        else:
            return None

        return q


class AssignedVideosDiaryViewSet(viewsets.ModelViewSet):
    """
    The api view to view assigned lessons.
    """
    serializer_class = AssignedVideosDiarySerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()

        _child = self.request.query_params.get('child')
        _lesson = self.request.query_params.get('lesson')

        if user.is_staff:
            return queryset
        elif _child:
            less = AssignedLesson.objects.all().filter(id=int(_lesson)).first()
            # q = queryset.filter(child_id=int(_child)).filter(lesson_id=int(_lesson)).order_by('video_id')
            q = queryset.filter(child_id=int(_child))
            q = q.filter(assigned_lesson=less)

        else:
            return None

        return q


class BookmarkViewSet(viewsets.ModelViewSet):
    """
    The api view to view bookmarked videos.
    """
    serializer_class = AssignedVideosSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()

        _child = self.request.query_params.get('child')

        if user.is_staff:
            return queryset
        elif _child:
            q = queryset.filter(child_id=int(_child))
            q = q.filter(bookmark=True)

        else:
            return None

        return q


class LogVideoViewSet(viewsets.ModelViewSet):
    """
    The api view to view bookmarked videos.
    """
    serializer_class = AssignedVideosSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedVideos.objects.all()
        children_list = Child.objects.all()
        final = []

        _parent = self.request.query_params.get('parent')

        children_list = children_list.filter(parent_id=int(_parent))

        if user.is_staff:
            return queryset
        elif _parent:
            for i in children_list:
                temp = queryset.filter(child=i)
                temp = temp.filter(Q(watched=True) | Q(react=True) | Q(bookmark=True) | Q(diary=True))
                final.extend(temp)
        else:
            return None

        return final


class AssignedVideosPostView(viewsets.ModelViewSet):
    """
    The api view to post an assigned video
    """
    serializer_class = AssignedVideosSerializer
    queryset = AssignedVideos.objects.all()


class AssignedLessonPostView(viewsets.ModelViewSet):
    """
    The api view to post a new assigned lesson to a child.
    """
    serializer_class = AssignedLessonPostSerializer
    queryset = AssignedLesson.objects.all()


class AssignedLessonGetView(viewsets.ModelViewSet):
    """
    The api view to get the assigned lessons to a child.
    """
    serializer_class = AssignedLessonPostSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedLesson.objects.all()
        lesson_queryset = Lesson.objects.all()

        _child = self.request.query_params.get('child')
        if user.is_staff:
            return lesson_queryset
        elif _child:
            q = queryset.filter(child_id=int(_child)).order_by('id')

        else:
            return None

        return q


class UnassignedLessonView(viewsets.ModelViewSet):
    """
    The api view to get the unassigned lessons of a child.
    """
    serializer_class = LessonSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedLesson.objects.all()
        lesson_queryset = Lesson.objects.all()
        _child = self.request.query_params.get('child')
        if user.is_staff:
            return lesson_queryset
        elif _child:
            queryset = queryset.filter(child_id=int(_child)).values_list('lesson')
            q = lesson_queryset.exclude(id__in=queryset)

        else:
            return None

        return q


class VideoFromLessonView(viewsets.ModelViewSet):
    """
    Gets videos from the lesson.
    """
    serializer_class = VideoSerializer

    def get_queryset(self):
        queryset = Video.objects.all()
        lesson = self.request.query_params.get('lesson')
        if lesson:
            queryset = queryset.filter(lesson_id=int(lesson))

        return queryset


class ProfileView(viewsets.ModelViewSet):
    """
    The api view to retrieve and create profiles, and their corresponding Django user.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfessionalView(viewsets.ModelViewSet):
    """
    The api view to retrieve and create professionals, profiles, and their corresponding Django user.
    """

    def get_queryset(self):
        user = self.request.user
        queryset = Professional.objects.all()
        if user.is_staff:
            queryset = Professional.objects.all()
        else:
            profile = Profile.objects.get(user=user)
            queryset = queryset.filter(profile=profile).all()

        return queryset

    serializer_class = ProfessionalSerializer


class ParentView(viewsets.ModelViewSet):
    """
    The api view to retrieve and create parents, profiles, and their corresponding Django user.
    """

    def prof_query(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        try:
            prof = Professional.objects.get(profile=profile)
        except Professional.DoesNotExist:
            prof = None

        return prof

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        queryset = Parent.objects.all()
        if user.is_staff:
            return queryset
        elif self.prof_query():
            professional = Professional.objects.get(profile=profile)
            queryset = queryset.filter(professional=professional).all().order_by('profile__user__first_name')
        else:
            queryset = queryset.filter(profile=profile).all()

        return queryset

    serializer_class = ParentSerializer


class ChildView(viewsets.ModelViewSet):
    """
    The api view to retrieve and create a parent and child.a
    """

    def prof_query(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        try:
            prof = Professional.objects.get(profile=profile)
        except Professional.DoesNotExist:
            prof = None

        return prof

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        queryset = Child.objects.all()
        if user.is_staff:
            queryset = Child.objects.all()

        elif self.prof_query():
            professional = Professional.objects.get(profile=profile)
            queryset = queryset.filter(professional=professional).all()
            queryset = queryset.filter(is_active=True)

        else:
            parent = Parent.objects.get(profile=profile)
            queryset = queryset.filter(parent=parent).all()
            queryset = queryset.filter(is_active=True)

        return queryset

    serializer_class = ChildSerializer


class ChildrenFromParent(viewsets.ModelViewSet):
    """
    The api view to retrieve the list of children from a parent id.
    """
    serializer_class = ChildSerializer

    def get_queryset(self):
        queryset = Child.objects.all()
        parent = self.request.query_params.get('parent')
        if parent:
            queryset = queryset.filter(parent_id=int(parent))

        return queryset


class PrivacyTermsView(viewsets.ModelViewSet):
    """
    The api view to retrieve the privacy and terms and conditions.
    """

    queryset = PrivacyTerms.objects.all()
    serializer_class = PrivacyTermsSerializer


class SupportTeamView(viewsets.ModelViewSet):
    """
    The api view to retrieve the support team.
    """
    queryset = Support.objects.all()
    serializer_class = SupportTeamSerializer
    allowed_methods = ['GET']


class ResourceView(viewsets.ModelViewSet):
    """
    The api view to retrieve resources.
    """

    def prof_query(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        try:
            prof = Professional.objects.get(profile=profile)
        except Professional.DoesNotExist:
            prof = None

        return prof

    def get_queryset(self):
        resources = list()
        user = self.request.user
        if user.is_staff:
            resources = Resource.objects.filter(active=True)
        elif self.prof_query():
            sources = Resource.objects.filter(active=True).filter(resource_type="Academic")
            for i in sources:
                resources.append(i)
        else:
            sources = Resource.objects.filter(active=True).filter(resource_type="Parental")
            for i in sources:
                resources.append(i)

        return resources

    serializer_class = ResourceSerializer


class AppointmentView(viewsets.ModelViewSet):
    """
    The api view to retrieve appointments.
    """

    def prof_query(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        try:
            prof = Professional.objects.get(profile=profile)
        except Professional.DoesNotExist:
            prof = None

        return prof

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        queryset = Appointment.objects.all()
        if user.is_staff:
            queryset = Appointment.objects.all()

        elif self.prof_query():
            professional = Professional.objects.get(profile=profile)
            queryset = queryset.filter(professional=professional).all()

            data = list()

            for i in queryset:
                y = datetime.strptime(i.start_time, '%I:%M %p')
                x = [y,i]
                data.append(x)

            sort_obj = sorted(data, key=lambda x: x[0])
            obj = [x[1] for x in sort_obj]
            return obj
        else:
            parent = Parent.objects.get(profile=profile)
            p = parent.professional.profile
            professional = Professional.objects.filter(profile=p).first()
            queryset = queryset.filter(professional=professional).all()
            data = list()

            for i in queryset:
                y = datetime.strptime(i.start_time, '%I:%M %p')
                x = [y,i]
                data.append(x)

            sort_obj = sorted(data, key=lambda x: x[0])
            obj = [x[1] for x in sort_obj]
            return obj

        return queryset

    serializer_class = AppointmentSerializer


class ContactProfessionalView(viewsets.ModelViewSet):
    queryset = ContactProfessional.objects.all()
    serializer_class = ContactProfessionalSerializer


class ContactSupportView(viewsets.ModelViewSet):
    queryset = ContactSupport.objects.all()
    serializer_class = ContactSupportSerializer
