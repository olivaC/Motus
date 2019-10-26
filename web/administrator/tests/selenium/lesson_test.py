from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class LessonTestCase(LiveServerTestCase):
    """
    Test resources on local environment to avoid adding lessons on the real server.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(LessonTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(LessonTestCase, self).tearDown()

    def test_0_add_lesson_page_exists(self):
        """
        Tests an add lesson page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        lesson_url = "/lessons"
        create_url = "/create-lesson"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        # Change test with superuser account
        email.send_keys('admin')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + lesson_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + create_url + '"]').click()
        selenium.implicitly_wait(2)

        self.assertTrue('Motus | Create Lesson\n\n' in selenium.page_source)

    def test_1_create_lesson_1_video(self):
        """
        Tests creating a lesson with one video.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        lesson_url = "/lessons"
        create_url = "/create-lesson"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        # Change test with superuser account
        email.send_keys('admin')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + lesson_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + create_url + '"]').click()

        selenium.find_element_by_id('id_lesson_name').send_keys("Selenium Test")
        selenium.find_element_by_name("video_set-0-video_name").send_keys("Video 1")
        selenium.find_element_by_name("video_set-0-link").send_keys("link")
        selenium.find_element_by_name("video_set-0-description").send_keys("description")

        selenium.find_element_by_xpath('//button[text()="Save"]').click()

        self.assertTrue("Selenium Test" in selenium.page_source)

    def test_1_create_lesson_more_than_one_video(self):
        """
        Tests creating a lesson with more than one video.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        lesson_url = "/lessons"
        create_url = "/create-lesson"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        # Change test with superuser account
        email.send_keys('admin')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + lesson_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + create_url + '"]').click()

        selenium.find_element_by_id('id_lesson_name').send_keys("Selenium Test")
        selenium.find_element_by_name("video_set-0-video_name").send_keys("Video 1")
        selenium.find_element_by_name("video_set-0-link").send_keys("link")
        selenium.find_element_by_name("video_set-0-description").send_keys("description")

        selenium.find_element_by_class_name("add-row").click()
        selenium.implicitly_wait(2)

        selenium.find_element_by_name("video_set-1-video_name").send_keys("Video 2")
        selenium.find_element_by_name("video_set-1-link").send_keys("link2")
        selenium.find_element_by_name("video_set-1-description").send_keys("description2")

        selenium.find_element_by_xpath('//button[text()="Save"]').click()

        self.assertTrue("Selenium Test" in selenium.page_source)
