from django import forms
from django.forms import ModelForm

from administrator.models import *


class VideoForm(ModelForm):
    """
    Form for a Video.
    """
    video_name = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                               'placeholder': "Video Name",
                                                               'class': 'form-control',
                                                               'required': True
                                                               }))
    link = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                         'placeholder': "Video Link",
                                                         'class': 'form-control',
                                                         'required': True}))
    description = forms.CharField(widget=forms.TextInput(attrs={'size': '100',
                                                                'placeholder': "Description",
                                                                'class': 'form-control',
                                                                'required': True}))

    class Meta:
        model = Video
        exclude = ('duration',)


class LessonForm(ModelForm):
    """
    Form for a Lesson.
    """
    picture_img = forms.FileInput()

    class Meta:
        model = Lesson
        exclude = ('creation_time', 'picture',)


class PrivacyTermsForm(forms.ModelForm):
    """
    Form for privacy and terms.
    """

    class Meta:
        model = PrivacyTerms
        fields = ('privacy', 'terms')


class SupportEmailForm(ModelForm):
    """
    Form for professional contact email.
    """

    email = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                          'placeholder': "Email",
                                                          'class': 'form-control',
                                                          'required': True
                                                          }))

    class Meta:
        model = SupportEmail
        fields = ('email',)


class ResourceForm(ModelForm):
    """
    Form for a Resource.
    """
    CHOICES = (
        ('Academic', 'Academic'),
        ('Parental', 'Parental'),
    )
    name = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                         'placeholder': "Resource Name",
                                                         'class': 'form-control',
                                                         'required': True
                                                         }))
    pdf_file = forms.FileInput()
    picture_img = forms.FileInput()
    teaser = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                           'placeholder': "Preview",
                                                           'class': 'form-control',
                                                           'required': True
                                                           }))
    resource_type = forms.ChoiceField(choices=CHOICES)
    active = forms.CheckboxInput(attrs={'class': 'form-control',
                                        'required': True})

    class Meta:
        model = Resource
        fields = ('name', 'pdf_file', 'resource_type', 'active', 'teaser', 'picture_img')
        exclude = ('picture',)


class SupportForm(ModelForm):
    """
    Form for Support team.
    """

    def __init__(self, *args, **kwargs):
        # first call parent's constructor
        super(SupportForm, self).__init__(*args, **kwargs)
        # there's a `fields` property now
        self.fields['picture'].required = False

    name = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                         'placeholder': "Name",
                                                         'class': 'form-control',
                                                         'required': True
                                                         }))
    position = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                             'placeholder': "Position",
                                                             'class': 'form-control',
                                                             'required': True
                                                             }))
    phone = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                          'placeholder': "Phone Number",
                                                          'class': 'form-control',
                                                          'required': True
                                                          }))

    email = forms.CharField(widget=forms.TextInput(attrs={'size': '50',
                                                          'placeholder': "Email Address",
                                                          'class': 'form-control',
                                                          'required': True
                                                          }))
    picture_img = forms.FileInput()

    picture = forms.CharField(widget=forms.HiddenInput())

    class Meta:
        model = Support
        fields = ('name', 'position', 'phone', 'email', 'picture_img')
        exclude = ('picture',)
