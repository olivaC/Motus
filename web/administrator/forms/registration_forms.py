from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from administrator.utilities.utils import clean_email


class LoginForm(forms.Form):
    """
    Form used to log in to the administrator web application.
    """
    email = forms.CharField(widget=forms.EmailInput(attrs=dict(required=True, max_length=30)), label="Email address")
    password = forms.CharField(widget=forms.PasswordInput(attrs=dict(required=True, max_length=30, render_value=False)),
                               label="Password")

    class Meta:
        fields = ['email', 'password']

    def clean(self):
        try:
            email = clean_email(self.cleaned_data['email'])
            User.objects.get(username__iexact=email)
            user = authenticate(username=email, password=self.cleaned_data['password'])
            if user is not None:
                if not user.is_authenticated:
                    raise forms.ValidationError("Email/password not found.")
            else:
                raise forms.ValidationError("Email/password not found.")
        except User.DoesNotExist:
            raise forms.ValidationError("Email/password not found")
        return self.cleaned_data
