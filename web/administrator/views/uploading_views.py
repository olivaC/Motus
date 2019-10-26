from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.forms import inlineformset_factory, model_to_dict, formset_factory
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponse
import base64

from administrator.forms.uploading_forms import *
from administrator.models import *
from administrator.utilities.utils import *


@login_required
def create_lesson_view(request):
    if request.method == "POST":
        video_formset = inlineformset_factory(Lesson, Video, form=VideoForm, fk_name="lesson", min_num=1, extra=0)
        next = request.POST.get("next", reverse("administrator:index"))
        lesson_form = LessonForm(request.POST, request.FILES)
        if lesson_form.is_valid():
            lesson = lesson_form.save(commit=False)
            lesson.picture = get_image(lesson_form.cleaned_data)
            lesson.picture_img = None
            if not lesson.creation_time:
                lesson.creation_time = timezone.now()
            lesson.save()
        else:
            return HttpResponseRedirect(next)
        video_formset = video_formset(request.POST, queryset=Video.objects.all())
        if video_formset.is_valid():
            for form in video_formset:
                video = form.save(commit=False)
                video.lesson = lesson
                video.duration, video.youtube_id = get_video_data(form.cleaned_data.get('link'))
                video.save()

            # Send notification to professionals
            aca_list = list()
            profs = Professional.objects.all()
            for i in profs:
                aca_list.append(i.profile.user_id)
            professional_new_lesson_notification(aca_list, lesson)

            return HttpResponseRedirect(next)
        else:
            lesson.delete()
    else:
        video_formset = inlineformset_factory(Lesson, Video, form=VideoForm, fk_name="lesson", min_num=1, extra=0)
        lesson_form = LessonForm()
        most_recent_lessons = Lesson.objects.all().order_by('-id')[:5]
        next = request.GET.get("next", reverse("administrator:index"))
    request.context['next'] = next
    request.context['most_recent_lessons'] = most_recent_lessons
    request.context['video_formset'] = video_formset
    request.context['lesson_formset'] = lesson_form
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'uploading/create_lesson.html', request.context)


@login_required
def privacy_terms_view(request):
    if request.method == "POST":
        priv_terms = PrivacyTerms.objects.last()
        form = PrivacyTermsForm(request.POST, initial=model_to_dict(priv_terms))
        if form.is_valid():
            priv_terms.privacy = form.cleaned_data.get('privacy')
            priv_terms.terms = form.cleaned_data.get('terms')
            priv_terms.save()

    priv_terms = PrivacyTerms.objects.last()
    if priv_terms:
        form = PrivacyTermsForm(initial=model_to_dict(priv_terms))
    else:
        form = PrivacyTermsForm()
    request.context['form'] = form
    request.context['user_tz_name'] = 'Canada/Mountain'
    return render(request, 'uploading/privacy_terms.html', request.context)


@login_required
def upload_resource_view(request):
    if request.method == "POST":
        upload_formset = formset_factory(ResourceForm, min_num=1, extra=0)
        next = request.POST.get("next", reverse("administrator:index"))
        upload_formset = upload_formset(request.POST, request.FILES)
        parental = False
        academic = False
        if upload_formset.is_valid():
            for form in upload_formset:
                resource = form.save(commit=False)
                resource.picture = get_image(form.cleaned_data)
                resource.picture_img = None
                resource.save()
                if not academic:
                    if resource.resource_type == "Academic" and resource.active:
                        academic = True
                if not parental:
                    if resource.resource_type == "Parental" and resource.active:
                        parental = True
            if parental:
                par_list = list()
                parents = Parent.objects.all()
                for i in parents:
                    par_list.append(i.profile.user_id)
                parent_resource_notification(par_list)
            if academic:
                aca_list = list()
                profs = Professional.objects.all()
                for i in profs:
                    aca_list.append(i.profile.user_id)
                professional_resource_notification(aca_list)

            return HttpResponseRedirect(next)
    else:
        upload_formset = formset_factory(ResourceForm, min_num=1, extra=0)
        next = request.GET.get("next", reverse("administrator:index"))

    most_recent_parental = Resource.objects.filter(resource_type='Parental').order_by('-id')[:5]
    most_recent_academic = Resource.objects.filter(resource_type='Academic').order_by('-id')[:5]
    request.context['parental'] = most_recent_parental
    request.context['academic'] = most_recent_academic
    request.context['next'] = next
    request.context['upload_formset'] = upload_formset
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'uploading/resources.html', request.context)


@login_required
def support_view(request):
    if request.method == "POST":
        support_formset = formset_factory(SupportForm, min_num=1, extra=0)
        next = request.POST.get("next", reverse("administrator:index"))
        upload_formset = support_formset(request.POST, request.FILES)
        Support.objects.all().delete()
        if upload_formset.is_valid():
            for form in upload_formset:
                support = form.save(commit=False)
                if not form.cleaned_data.get('picture'):
                    support.picture = get_image(form.cleaned_data)
                elif form.cleaned_data.get('picture_img') and form.cleaned_data.get('picture'):
                    # Upload + old picture
                    support.picture = get_image(form.cleaned_data)
                else:
                    support.picture = form.cleaned_data.get('picture')
                support.picture_img = None
                support.save()
            return HttpResponseRedirect(next)
    else:
        support_formset = formset_factory(SupportForm, min_num=1, extra=0)
        data = Support.objects.all().values()
        forms = support_formset(initial=data)
        next = request.GET.get("next", reverse("administrator:index"))

    request.context['next'] = next
    request.context['support_formset'] = forms
    request.context['user_tz_name'] = 'Canada/Mountain'

    return render(request, 'uploading/support.html', request.context)


def support_email_view(request):
    if request.method == "POST":
        next = request.POST.get("next", reverse("administrator:index"))
        support = SupportEmail.objects.last()
        form = SupportEmailForm(request.POST, initial=model_to_dict(support))
        if form.is_valid():
            if form.cleaned_data.get('email'):
                print(form.cleaned_data.get('email'))
                support.email = form.cleaned_data.get('email')
                support.save()
                return HttpResponseRedirect(next)
    support = SupportEmail.objects.last()
    form = SupportEmailForm(initial=model_to_dict(support))
    request.context['form'] = form
    return render(request, "uploading/support_contact.html", request.context)


def support_photo(request, support):
    res = Support.objects.get(id=support)
    x = res.picture
    prefix = 'data:img/png;base64,'
    x = x[len(prefix):]
    return HttpResponse(base64.b64decode(x), content_type="image/jpg")
