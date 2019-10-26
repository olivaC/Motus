from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse
import base64

from administrator.models import *
from motus import settings


@login_required
def lessons_view(request):
    all_lessons = Lesson.objects.all()
    request.context['lessons'] = all_lessons
    request.context['user_tz_name'] = 'Canada/Mountain'
    return render(request, 'lesson/lessons.html', request.context)


@login_required
def lesson_detail_view(request, id):
    """
    The detailed view of a lesson in the Motus Application.

    :param request:
    :return: View of an individual lesson.
    """
    lesson = Lesson.objects.all().filter(id=id).first()
    videos = Video.objects.all().filter(lesson=lesson)

    videos_total = len(videos)
    a_lessons = AssignedLesson.objects.all().filter(lesson=lesson)
    v_lessons = AssignedVideos.objects.all().filter(assigned_lesson__lesson=lesson)

    final = dict()
    videos_dict = dict()

    for j in videos:
        reaction_dict = {
            'favorite': 0,
            'angry': 0,
            'love': 0,
            'sad': 0,
            'relaxed': 0,
            'surprised': 0,
        }
        for i in v_lessons:
            if i.video_id == j.id:
                if i.bookmark:
                    reaction_dict['favorite'] += 1
                if i.reaction == 'angry':
                    reaction_dict['angry'] += 1
                elif i.reaction == 'love':
                    reaction_dict['love'] += 1
                elif i.reaction == 'sad':
                    reaction_dict['sad'] += 1
                elif i.reaction == 'relaxed':
                    reaction_dict['relaxed'] += 1
                elif i.reaction == 'surprised':
                    reaction_dict['surprised'] += 1

        videos_dict[j.id] = reaction_dict

    request.context['videos'] = videos
    request.context['lesson'] = lesson
    request.context['lesson_count'] = len(a_lessons)
    request.context['a_lessons'] = a_lessons
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['vid_data'] = videos_dict
    request.context['path'] = settings.DOMAIN

    return render(request, 'lesson/individual_lesson.html', request.context)


def lesson_count(request, lesson, child):
    if request.method == 'GET':
        video_count = 0
        videos = AssignedVideos.objects.all().filter(child_id=child)
        videos = videos.filter(assigned_lesson_id=lesson)
        for i in videos:
            if i.watched:
                video_count += 1
        if len(videos):
            video_total = len(videos)
            count = float(video_count / video_total)
        else:
            count = 0

        return HttpResponse(count, content_type="text/plain")


def lesson_photo(request, lesson):
    lesson = Lesson.objects.get(id=lesson)
    x = lesson.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    print(x)
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")
