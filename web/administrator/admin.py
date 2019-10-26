from django.contrib import admin

# Register your models here.
from administrator.models import *

admin.site.register(Profile)
admin.site.register(Lesson)
admin.site.register(Video)
admin.site.register(Professional)
admin.site.register(Parent)
admin.site.register(Child)
admin.site.register(AssignedVideos)
admin.site.register(PrivacyTerms)
admin.site.register(Resource)
admin.site.register(Support)
admin.site.register(PasswordResetCode)
admin.site.register(Appointment)
admin.site.register(AssignedLesson)
admin.site.register(SupportEmail)
admin.site.register(ContactSupport)
