from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.http import HttpResponseRedirect
from django.shortcuts import render
from itertools import chain
import base64

from django.urls import reverse, exceptions
from django.http import HttpResponse

from administrator.models import *
from motus import settings


@login_required
def all_users_view(request):
    """
    The view for all users in the Motus Application.

    :param request:
    :return: All users.
    """

    child = Child.objects.all()
    professional = Professional.objects.all()
    parent = Parent.objects.all()
    all_users = list(chain(child, professional, parent))

    request.context['children'] = child
    request.context['professionals'] = professional
    request.context['parents'] = parent
    request.context['all_users'] = all_users
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'users/all_users.html', request.context)


@login_required
def professional_view(request):
    """
    The view to view all of the Mental Health Professionals registered in the Motus Application.

    :param request:
    :return: All Mental Health Professionals.
    """
    professional = Professional.objects.all()
    active = professional.filter(profile__user__is_active=True)
    inactive = professional.filter(profile__user__is_active=False)
    request.context['active_professionals'] = active
    request.context['inactive_professionals'] = inactive
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['path'] = settings.DOMAIN

    return render(request, 'users/professionals.html', request.context)


@login_required
def professional_detail_view(request, id):
    """
    The detailed view of a Mental Health Professionals registered in the Motus Application.

    :param request:
    :return: View of mental health professional.
    """
    professional = Professional.objects.all()
    prof = professional.filter(id=id).first()

    parents = Parent.objects.all().filter(professional=prof)
    children = Child.objects.all().filter(professional=prof)
    resources = Resource.objects.all().filter(resource_type="Academic")

    request.context['professional'] = prof
    request.context['parents'] = parents
    request.context['children'] = children
    request.context['resources'] = resources
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['path'] = settings.DOMAIN

    return render(request, 'users/professional_detail.html', request.context)


@login_required
def parent_view(request):
    """
    The view to view all of the parents registered in the Motus Application.

    :param request:
    :return: All parents.
    """
    parent = Parent.objects.all()
    active = parent.filter(profile__user__is_active=True)
    inactive = parent.filter(profile__user__is_active=False)
    request.context['active_parents'] = active
    request.context['inactive_parents'] = inactive
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['path'] = settings.DOMAIN
    request.context['user_tz_name'] = 'Canada/Mountain'
    return render(request, 'users/parents.html', request.context)


@login_required
def parent_detail_view(request, id):
    """
    The detailed view of a parent registered in the Motus Application.

    :param request:
    :return: View of mental health professional.
    """
    parent = Parent.objects.all()
    parent = parent.filter(id=id).first()
    prof_id = parent.professional.id
    prof = Professional.objects.all().filter(id=prof_id)
    children = Child.objects.all()
    child = children.filter(parent=parent)
    resources = Resource.objects.all().filter(resource_type="Parental")
    request.context['parent'] = parent
    request.context['professional'] = prof
    request.context['resources'] = resources
    request.context['children'] = child
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['path'] = settings.DOMAIN

    return render(request, 'users/parent_detail.html', request.context)


@login_required
def child_view(request):
    """
    The view to view all of the children registered in the Motus Application.

    :param request:
    :return: All children.
    """
    child = Child.objects.all()
    active = child.filter(is_active=True)
    inactive = child.filter(is_active=False)
    request.context['active_children'] = active
    request.context['inactive_children'] = inactive
    request.context['path'] = settings.DOMAIN
    request.context['user_tz_name'] = 'Canada/Mountain'
    return render(request, 'users/children.html', request.context)


@login_required
def deactivate_child_view(request, id):
    """
    Deactivate a child
    :param request:
    :param Id of the child
    :return:
    """
    child = Child.objects.filter(id=id).first()
    if child:
        child.is_active = False
        child.save()
    return HttpResponseRedirect(reverse("administrator:children"))


@login_required
def activate_child_view(request, id):
    """
    Activate a child
    :param request:
    :param Id of the child
    :return:
    """
    child = Child.objects.filter(id=id).first()
    if child:
        child.is_active = True
        child.save()
    return HttpResponseRedirect(reverse("administrator:children"))


@login_required
def child_detail_view(request, id):
    """
    The detailed view of a child registered in the Motus Application.

    :param request:
    :return: View of mental health professional.
    """
    child = Child.objects.all()
    child = child.filter(id=id).first()
    par_id = child.parent.id
    parent = Parent.objects.all().filter(id=par_id)
    prof_id = child.professional.id
    professional = Professional.objects.all().filter(id=prof_id)
    lessons = AssignedLesson.objects.all().filter(child=child)
    finished_lesson = AssignedLesson.objects.all().filter(child=child).filter(completed=True)
    videos = AssignedVideos.objects.all().filter(child=child).filter(bookmark=True)
    assigned_videos = AssignedVideos.objects.all().filter(child=child)

    num_lessons = len(lessons)
    num_finished = len(finished_lesson)
    if num_lessons:
        percent_finished = (num_finished / num_lessons) * 100
    else:
        percent_finished = 0

    request.context['parent'] = parent
    request.context['professional'] = professional
    request.context['child'] = child
    request.context['user_tz_name'] = 'Canada/Mountain'
    request.context['path'] = settings.DOMAIN
    request.context['lessons'] = lessons
    request.context['videos'] = videos
    request.context['assigned_videos'] = assigned_videos
    request.context['percent'] = int(percent_finished)

    # TODO: Add assigned lessons for sprint 4

    return render(request, 'users/child_detail.html', request.context)


@login_required
def deactivate_professional_view(request, id):
    """
    Deactivate a professional
    :param request:
    :param Id of the professional
    :return:
    """
    prof = Professional.objects.filter(id=id).first()
    if prof:
        user = prof.profile.user
        user.is_active = False
        user.save()
    return HttpResponseRedirect(reverse("administrator:professionals"))


@login_required
def activate_professional_view(request, id):
    """
    Activate a professional
    :param request:
    :param Id of the professional
    :return:
    """
    prof = Professional.objects.filter(id=id).first()
    if prof:
        user = prof.profile.user
        user.is_active = True
        user.save()
    return HttpResponseRedirect(reverse("administrator:professionals"))


@login_required
def deactivate_parent_view(request, id):
    """
    Deactivate a parent
    :param request:
    :param Id of the parent
    :return:
    """
    par = Parent.objects.filter(id=id).first()
    if par:
        user = par.profile.user
        user.is_active = False
        user.save()
    return HttpResponseRedirect(reverse("administrator:parents"))


@login_required
def activate_parent_view(request, id):
    """
    Activate a parent
    :param request:
    :param Id of the parent
    :return:
    """
    par = Parent.objects.filter(id=id).first()
    if par:
        user = par.profile.user
        user.is_active = True
        user.save()
    return HttpResponseRedirect(reverse("administrator:parents"))


@login_required
def remove_user_view(request, id, x):
    """
    Helper function for a coordinator to delete a volunteer.
    :param request:
    :param hash:
    :return:
    """

    if x == 'c':
        child = Child.objects.filter(id=id).first()
        if child:
            child.delete()
    elif x == 'pa':
        parent = Parent.objects.filter(id=id).first()
        if parent:
            parent.delete()
    else:
        professional = Professional.objects.filter(id=id).first()
        if professional:
            professional.delete()

    return HttpResponseRedirect(reverse("administrator:users"))


def password_reset_view(request):
    """
    View to change a parent's password.

    :param request:
    :return: reset_password.html
    """
    if request.method == "POST":
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")
        email = request.POST.get("email")
        user = User.objects.filter(username=email).first()
        if not password1:
            return HttpResponseRedirect(reverse("administrator:password_reset"))
        elif password1 != password2:
            return HttpResponseRedirect(reverse("administrator:password_reset"))
        elif not user:
            return HttpResponseRedirect(reverse("administrator:password_reset"))
        else:
            try:
                validate_password(password=password1, user=User)
                user.set_password(password1)
                user.save()
                return HttpResponseRedirect(reverse("administrator:password_success"))
            except:
                return HttpResponseRedirect(reverse("administrator:password_success"))

    return render(request, "password/reset_password.html", request.context)


def successful_password_view(request):
    return render(request, "password/successful.html")


def child_photo(request, child):
    chi = Child.objects.get(id=child)
    x = chi.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")


def parent_photo(request, parent):
    par = Parent.objects.get(id=parent)
    x = par.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    print(x)
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")


def professional_photo(request, professional):
    prof = Professional.objects.get(id=professional)
    x = prof.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    print(x)
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")
