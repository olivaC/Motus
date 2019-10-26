from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from datetime import timedelta
import heapq

from administrator.forms.registration_forms import LoginForm
from administrator.models import *
from administrator.utilities.utils import unquote_redirect_url


@login_required
def index(request):
    """
    The dashboard page for the Motus Administrator application

    :param request:
    :return: The index page
    """
    professional_count = Professional.objects.all().filter(
        creation_time__gte=timezone.now() - timedelta(days=7)).count()
    parent_count = Parent.objects.all().filter(creation_time__gte=timezone.now() - timedelta(days=7)).count()
    child_count = Child.objects.all().filter(creation_time__gte=timezone.now() - timedelta(days=7)).count()
    all_lessons = Lesson.objects.all().order_by('-creation_time')[:5]
    videos = Video.objects.all().order_by('id')
    watched_assigned_videos = AssignedVideos.objects.all().filter(watched=True)
    favorited_assigned_videos = AssignedVideos.objects.all().filter(bookmark=True)

    vid_watched = AssignedVideos.objects.all().filter(watched=True).filter(
        date_completed__gte=timezone.now() - timedelta(days=7)).order_by('date_completed').count()

    # Get last logged in children
    recent_children = Child.objects.all().filter(last_login_time__isnull=False).filter(
        last_login_time__gte=timezone.now() - timedelta(days=7)).order_by('-last_login_time')

    vid_dict = {}
    vid_dict2 = {}
    for i in videos:
        vid_dict[i.id] = 0
        vid_dict2[i.id] = 0

    for j in watched_assigned_videos:
        if j.video_id in vid_dict:
            vid_dict[j.video_id] += 1

    for l in favorited_assigned_videos:
        if l.video_id in vid_dict2:
            vid_dict2[l.video_id] += 1

    # Taken from https://stackoverflow.com/questions/50644186/filter-dictionary-and-remove-lowest-values
    val = heapq.nlargest(3, vid_dict.values())[-1]
    most_watched = {k: v for k, v in vid_dict.items() if v >= val}

    val2 = heapq.nlargest(3, vid_dict2.values())[-1]
    most_favorited = {k: v for k, v in vid_dict2.items() if v >= val2}

    most_watched_vids = list()
    for key in most_watched:
        temp = videos.filter(id=key).first()
        most_watched_vids.append(temp)

    most_fave_vids = list()
    for key in most_favorited:
        temp = videos.filter(id=key).first()
        most_fave_vids.append(temp)

    request.context['professional_count'] = professional_count
    request.context['parent_count'] = parent_count
    request.context['child_count'] = child_count
    request.context['all_lessons'] = all_lessons[:3]
    request.context['videos'] = videos
    request.context['recent_children'] = recent_children[:3]
    request.context['weekly_vids'] = vid_watched
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['most_watched_count'] = most_watched
    request.context['most_watched_vid'] = most_watched_vids[:3]
    request.context['most_fave_count'] = most_favorited
    request.context['most_fave_vid'] = most_fave_vids[:3]
    return render(request, 'index.html', request.context)


@login_required
def logout_view(request):
    """
    View used for logging out.

    :param request:
    :return: The index page.
    """
    logout(request)
    return HttpResponseRedirect(request.GET.get(next, reverse("administrator:index")))


def login_view(request):
    """
    The view for logging into the Motus Administrator application.

    :param request:
    :return: Log in, and redirect to the page trying to get to.
    """
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data['email'], password=form.cleaned_data['password'])
            login(request, user)
            redirect_url = request.POST.get('next', reverse("administrator:index"))
            return HttpResponseRedirect(unquote_redirect_url(redirect_url))
        else:
            request.context['next'] = unquote_redirect_url(request.GET.get('next', reverse("administrator:index")))
    else:
        request.context['next'] = request.GET.get('next', '')
        form = LoginForm()
    request.context['form'] = form
    request.context['user_tz_name'] = 'Canada/Mountain'
    return render(request, 'login.html', request.context)
