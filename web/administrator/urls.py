from django.conf.urls import url
from django.urls import path, include, re_path

import administrator.views.lessons_views
import administrator.views.resources_views
from administrator.views import views, user_views, uploading_views, api_views, resources_views, lessons_views
from rest_framework import routers
from django.conf.urls.static import static
from rest_auth import urls

from motus import settings

app_name = 'administrator'

# API routes
router = routers.DefaultRouter()
router.register('lessons', api_views.LessonView)
router.register('videos', api_views.VideoView)
router.register('profile', api_views.ProfileView)
router.register('professional', api_views.ProfessionalView, base_name='professional_record')
router.register('parent', api_views.ParentView, base_name='parent_record')
router.register('child', api_views.ChildView, base_name='child_record')
router.register('privacy', api_views.PrivacyTermsView)
router.register('support', api_views.SupportTeamView, base_name='support')
router.register('resource', api_views.ResourceView, base_name='resource')
router.register('appointment', api_views.AppointmentView, base_name='appointment')
router.register('lesson_videos', api_views.VideoFromLessonView, base_name='video_lesson')
router.register('children_parent', api_views.ChildrenFromParent, base_name='children_parent')
router.register('assigned_lesson_get', api_views.AssignedLessonGetView, base_name='assigned_lesson_get'),
router.register('assigned_lesson_post', api_views.AssignedLessonPostView, base_name='assigned_lesson_post'),
router.register('unassigned_lesson', api_views.UnassignedLessonView, base_name='unassigned_lesson')
router.register('assigned_videos', api_views.AssignedVideosViewSet, base_name='assigned_videos')
router.register('bookmarked_videos', api_views.BookmarkViewSet, base_name='bookmarked_videos')
router.register('contact_professional', api_views.ContactProfessionalView, base_name='contact_professional')
router.register('assigned_videos_reaction', api_views.AssignedVideosReactionViewSet,
                base_name='assigned_videos_reaction')
router.register('assigned_videos_time', api_views.AssignedVideosTimeViewSet, base_name='assigned_videos_time')
router.register('parent_log', api_views.LogVideoViewSet, base_name='parent_log')
router.register('diary_entry', api_views.AssignedVideosDiaryViewSet, base_name='diary_entry')
router.register('contact_support', api_views.ContactSupportView, base_name='contact_support')

urlpatterns = [
    path('', views.index),
    path('index', views.index, name="index"),
    path('accounts/login/', views.login_view, name="login"),
    path('accounts/logout', views.logout_view, name="logout"),
    path('users/', user_views.all_users_view, name="users"),
    path('users/remove/<int:id>/<str:x>/', user_views.remove_user_view, name="remove_user"),
    path('resources/parental/remove/<int:id>/', resources_views.remove_parental_resources_view,
         name="remove_parental_resource"),
    path('resources/parental/deactivate/<int:id>/', resources_views.deactivate_parental_resources_view,
         name="deactivate_parental_resource"),
    path('resources/parental/activate/<int:id>/', resources_views.activate_parental_resources_view,
         name="activate_parental_resource"),
    path('resources/academic/remove/<int:id>/', resources_views.remove_professional_resources_view,
         name="remove_professional_resource"),
    path('resources/academic/deactivate/<int:id>/', resources_views.deactivate_professional_resources_view,
         name="deactivate_professional_resource"),
    path('resources/academic/activate/<int:id>/', resources_views.activate_professional_resources_view,
         name="activate_professional_resource"),
    path('professionals', user_views.professional_view, name="professionals"),
    path('professionals/deactivate/<int:id>/', user_views.deactivate_professional_view,
         name="deactivate_professional"),
    path('professionals/activate/<int:id>/', user_views.activate_professional_view,
         name="activate_professional"),
    path('professionals/<int:id>/', user_views.professional_detail_view,
         name="professional_detail"),
    path('parents', user_views.parent_view, name="parents"),
    path('parents/deactivate/<int:id>/', user_views.deactivate_parent_view,
         name="deactivate_parent"),
    path('parents/activate/<int:id>/', user_views.activate_parent_view,
         name="activate_parent"),
    path('parents/<int:id>/', user_views.parent_detail_view,
         name="parent_detail"),
    path('children', user_views.child_view, name="children"),
    path('children/deactivate/<int:id>/', user_views.deactivate_child_view,
         name="deactivate_child"),
    path('children/activate/<int:id>/', user_views.activate_child_view,
         name="activate_child"),
    path('children/<int:id>/', user_views.child_detail_view,
         name="child_detail"),
    path('create-lesson', uploading_views.create_lesson_view, name="createlesson"),
    path('lessons', administrator.views.lessons_views.lessons_view, name="lessons"),
    path('lessons/<int:id>/', lessons_views.lesson_detail_view, name="lessons_detail"),
    path('api/', include(router.urls)),
    re_path(r'^rest-auth/', include('rest_auth.urls')),
    path('privacy_terms', uploading_views.privacy_terms_view, name="privacy_terms"),
    path('resources', uploading_views.upload_resource_view, name='resources'),
    path('support', uploading_views.support_view, name='support'),
    path('reset-password/', user_views.password_reset_view, name='password_reset'),
    path('success/', user_views.successful_password_view, name='password_success'),
    path('parental-resources', resources_views.parental_resources_view, name='parental_resources'),
    path('academic-resources', resources_views.professional_resources_view, name='academic_resources'),
    path('lesson_count/<int:lesson>/<int:child>/', lessons_views.lesson_count),
    path('child_photo/<int:child>/', user_views.child_photo),
    path('parent_photo/<int:parent>/', user_views.parent_photo),
    path('professional_photo/<int:professional>/', user_views.professional_photo),
    path('lesson_photo/<int:lesson>/', lessons_views.lesson_photo),
    path('resource_photo/<int:resource>/', resources_views.resource_photo),
    path('support_photo/<int:support>/', uploading_views.support_photo),
    path('support_email/', uploading_views.support_email_view, name='support_email'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
