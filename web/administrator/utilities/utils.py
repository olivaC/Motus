import hashlib
import time
import urllib.parse
import pafy
import onesignal as onesignal_sdk

import sendgrid
from sendgrid.helpers.mail import *
from motus import settings
from PIL import Image
from io import BytesIO
import base64


def get_image(validated_data):
    x = validated_data['picture_img'].file
    p = Image.open(x)
    p = p.convert('RGB')
    buffered = BytesIO()
    p.save(buffered, format="JPEG", quality=20, optimize=True)
    encoded_picture = str(base64.b64encode(buffered.getvalue()), 'utf-8')
    print(len(encoded_picture))
    img_str = "data:img/png;base64,"
    return "{}{}".format(img_str, encoded_picture)


def hash_generator(model_id, length=None):
    """
    Generates a unique hash of length 30.

    :param model_id: The id of the specific model
    :param length: The length of the hash
    :return: A unique hash of length 30
    """
    hash_unique = hashlib.sha1()
    hash_unique.update((str(model_id) + '!#@$%&^*MOTUS' + str(time.time())).encode("utf-8"))
    if length is None:
        return hash_unique.hexdigest()[-30:]
    else:
        return hash_unique.hexdigest()[-length:]


def clean_email(email):
    """
    Generates an email with a normalized lowercase domain. The username is case sensitive.

    :param email: The email address entered.
    :return: An email
    """
    try:
        part1, domain = email.strip().rsplit('@', 1)
    except ValueError:
        pass
    else:
        email = '@'.join([part1, domain.lower()])
    return email


def unquote_redirect_url(url):
    """
    Unquotes url

    :param url:
    :return:
    """
    url = urllib.parse.unquote(url)
    if url.endswith("/") and not url == '/':
        return url[:-1]
    return url


def url_with_params(path, parameters_dict=None):
    """
    Creates a url with parameters.

    :param path:
    :param parameters_dict:
    :return:
    """
    if parameters_dict is None:
        parameters_dict = dict()
    if path[-3:] == "%3F":
        path = path[:-3]
    return path + '?' + urllib.parse.urlencode(parameters_dict)


def send_password_reset(parent_email, data):
    """
    Sends an email using sendgrid.

    :param parent_email: the parents email.
    :param data: The body of the email.
    :return:
    """
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API)
    from_email = Email(settings.EMAIL)
    to_email = Email(parent_email)
    subject = "MOTUS: Reset your password"
    content = Content("text/plain", data)
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)


def send_professional_message(parent_email, parent_name, professional_email, data):
    """
    Sends an email using sendgrid.

    :param parent_name: Parents name
    :param professional_email: the professionals email
    :param parent_email: the parents email.
    :param data: The body of the email.
    :return:
    """
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API)
    from_email = Email(parent_email)
    to_email = Email(professional_email)
    subject = "MOTUS: Message from {}".format(parent_name)
    content = Content("text/plain", data)
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)


def send_support_message(support_email, prof_name, professional_email, data):
    """
    Sends an email using sendgrid.

    :param prof_name: Parents name
    :param professional_email: the professionals email
    :param support_email: the parents email.
    :param data: The body of the email.
    :return:
    """
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API)
    from_email = Email(professional_email)
    to_email = Email(support_email)
    subject = "MOTUS SUPPORT: Message from {}".format(prof_name)
    content = Content("text/plain", data)
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)


def get_video_data(url):
    """
    Uses the Pafy library to get the duration of the youtube video.
    :param url: Url of the video link.
    :return: The duration of the video
    """
    pafy.set_api_key(settings.YOUTUBE_API)
    video = pafy.new(url)
    return video.duration, video.videoid


def parent_resource_notification(data):
    """
    Used to send parents notifications about new resources
    :param data: List of parent user IDs
    :return:
    """
    filter_list = list()

    for i, item in enumerate(data):
        if i < len(data) - 1:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})
            filter_list.append({"operator": "OR"})
        else:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})

    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PARENT_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PARENT_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PARENT_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()

    new_notification.set_parameter("template_id", settings.PARENT_ONESIGNAL_RESOURCES_TEMPLATE_ID)

    # set filters
    new_notification.set_filters(filter_list)

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


def parent_new_lesson_notification(parent, child, lesson):
    """
    Used to send parents notifications about children assigned lessons.
    :param parent:
    :param child:
    :param lesson:
    :return:
    """
    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PARENT_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PARENT_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PARENT_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()
    new_notification.set_parameter("contents", {
        "en": "{} {} has been assigned lesson: {}.".format(child.first_name, child.last_name, lesson.lesson_name)})
    new_notification.set_parameter("headings", {"en": "MOTUS: New assigned lesson!"})
    new_notification.set_parameter("template_id", settings.PARENT_ONESIGNAL_NEW_LESSON_TEMPLATE_ID)

    # set filters
    new_notification.set_filters([{"field": "tag", "key": "id", "relation": "=", "value": str(parent.profile.user_id)}])

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


def parent_appointment_notification(parent, professional, appointment, booked):
    """
    Used to send parents notifications about children assigned lessons.
    :param parent:
    :param child:
    :param lesson:
    :return:
    """
    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PARENT_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PARENT_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PARENT_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()
    new_notification.set_parameter("contents", {
        "en": "Appointment with {} on {} from {} to {}, has been {}.".format(professional.profile.full_name,
                                                                             appointment.date.strftime('%m/%d/%Y'),
                                                                             appointment.start_time,
                                                                             appointment.end_time, booked)})
    new_notification.set_parameter("headings", {"en": "MOTUS: Appointment {}".format(booked)})
    new_notification.set_parameter("template_id", settings.PARENT_ONESIGNAL_APPOINTMENT_TEMPLATE_ID)

    # set filters
    new_notification.set_filters([{"field": "tag", "key": "id", "relation": "=", "value": str(parent.profile.user_id)}])

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


def professional_resource_notification(data):
    """
    Used to send professional notifications about new resources
    :param data: List of professional user IDs
    :return:
    """
    filter_list = list()

    for i, item in enumerate(data):
        if i < len(data) - 1:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})
            filter_list.append({"operator": "OR"})
        else:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})

    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PROFESSIONAL_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PROFESSIONAL_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PROFESSIONAL_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()

    new_notification.set_parameter("template_id", settings.PROFESSIONAL_ONESIGNAL_RESOURCES_TEMPLATE_ID)

    # set filters
    new_notification.set_filters(filter_list)

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


def professional_new_lesson_notification(data, lesson):
    """

    :param data:
    :param lesson:
    :return:
    """
    filter_list = list()

    for i, item in enumerate(data):
        if i < len(data) - 1:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})
            filter_list.append({"operator": "OR"})
        else:
            filter_list.append({"field": "tag", "key": "id", "relation": "=", "value": str(item)})

    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PROFESSIONAL_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PROFESSIONAL_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PROFESSIONAL_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()
    new_notification.set_parameter("contents", {
        "en": "New lesson: '{}' can now be assigned.".format(lesson.lesson_name)})
    new_notification.set_parameter("headings", {"en": "MOTUS: New lessons added!"})
    new_notification.set_parameter("template_id", settings.PROFESSIONAL_ONESIGNAL_NEW_LESSON_TEMPLATE_ID)

    # set filters
    new_notification.set_filters(filter_list)

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


def professional_appointment_notification(professional, parent, appointment):
    """
    Send professional appoint request push notifications.
    :param professional:
    :param parent:
    :param appointment:
    :return:
    """
    onesignal_client = onesignal_sdk.Client(user_auth_key=settings.PROFESSIONAL_ONESIGNAL_AUTH_KEY,
                                            app={"app_auth_key": settings.PROFESSIONAL_ONESIGNAL_REST_KEY,
                                                 "app_id": settings.PROFESSIONAL_ONESIGNAL_APP_ID})

    # create a notification
    new_notification = onesignal_sdk.Notification()
    new_notification.set_parameter("contents", {
        "en": "Appointment request from {} on {} from {}-{}.".format(parent.profile.full_name,
                                                                     appointment.date.strftime('%m/%d/%Y'),
                                                                     appointment.start_time,
                                                                     appointment.end_time)})
    new_notification.set_parameter("headings", {"en": "MOTUS: Appointment request"})
    new_notification.set_parameter("template_id", settings.PROFESSIONAL_ONESIGNAL_APPOINTMENT_TEMPLATE_ID)

    # set filters
    new_notification.set_filters(
        [{"field": "tag", "key": "id", "relation": "=", "value": str(professional.profile.user_id)}])

    # send notification, it will return a response
    onesignal_response = onesignal_client.send_notification(new_notification)
    print(onesignal_response.status_code)
    print(onesignal_response.json())


profile_default_image = "data:img/png;base64,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"
