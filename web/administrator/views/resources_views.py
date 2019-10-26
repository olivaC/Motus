from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponse
import base64

from administrator.models import Resource
from motus import settings


@login_required
def remove_parental_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.delete()
    return HttpResponseRedirect(reverse("administrator:parental_resources"))


@login_required
def deactivate_parental_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.active = False
        resource.save()
    return HttpResponseRedirect(reverse("administrator:parental_resources"))


@login_required
def activate_parental_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.active = True
        resource.save()
    return HttpResponseRedirect(reverse("administrator:parental_resources"))


@login_required
def remove_professional_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.delete()
    return HttpResponseRedirect(reverse("administrator:academic_resources"))


@login_required
def deactivate_professional_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.active = False
        resource.save()
    return HttpResponseRedirect(reverse("administrator:academic_resources"))


@login_required
def activate_professional_resources_view(request, id):
    resource = Resource.objects.filter(id=id).first()
    if resource:
        resource.active = True
        resource.save()
    return HttpResponseRedirect(reverse("administrator:academic_resources"))


@login_required
def parental_resources_view(request):
    """
    Parental resource view.
    :param request:
    :return:
    """
    all_resources = Resource.objects.all()
    parental = all_resources.filter(resource_type="Parental")
    active = parental.filter(active=True)
    inactive = parental.filter(active=False)
    request.context['path'] = settings.DOMAIN
    request.context['active_resources'] = active
    request.context['inactive_resources'] = inactive
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'resources/parental.html', request.context)


@login_required
def professional_resources_view(request):
    """
    Academic mental health professional resource view.
    :param request:
    :return:
    """
    all_resources = Resource.objects.all()
    parental = all_resources.filter(resource_type="Academic")
    active = parental.filter(active=True)
    inactive = parental.filter(active=False)
    request.context['path'] = settings.DOMAIN
    request.context['active_resources'] = active
    request.context['inactive_resources'] = inactive
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'resources/professional.html', request.context)


def resource_photo(request, resource):
    res = Resource.objects.get(id=resource)
    x = res.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    print(x)
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")
