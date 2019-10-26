from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class AccountTestCase(LiveServerTestCase):

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(AccountTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(AccountTestCase, self).tearDown()

    def test_login_page_exists(self):
        """
        Tests that the home page/login page exists.
        :return:
        """
        selenium = self.selenium
        selenium.get('http://127.0.0.1:8000/')
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        assert email and password is not None

    def test_unsuccessful_login(self):
        """
        Tests an unsuccessful login has an error message and stays on the login page.
        :return:
        """

        selenium = self.selenium
        # Opening the link we want to test
        selenium.get('http://127.0.0.1:8000/accounts/login/?next=/index')
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        email.send_keys('motus401@ualberta.ca')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        self.selenium.implicitly_wait(2)

        # check the returned result
        self.assertTrue('Sorry, the username and password could not be found.' in selenium.page_source)

    def test_successful_login(self):
        """
        Tests a successful login goes to the dashboard.
        :return:
        """
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get('http://127.0.0.1:8000/accounts/login/?next=/index')
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        email.send_keys('motus401@gmail.com')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        self.selenium.implicitly_wait(2)

        # check the returned result
        x = selenium.page_source
        self.assertTrue('Motus | Dashboard\n\n' in selenium.page_source)
