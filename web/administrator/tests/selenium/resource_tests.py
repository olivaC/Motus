import os

from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys


class ResourcesTestCase(LiveServerTestCase):
    """
    Test resources on local environment to avoid adding pdfs to the real server.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(ResourcesTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(ResourcesTestCase, self).tearDown()

    def test_0_add_resources_page_exists(self):
        """
        Tests a privacy page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        privacy_url = "/resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + privacy_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + privacy_url + '"]')[1].click()
        selenium.implicitly_wait(2)

        self.assertTrue('Motus | Upload Resources\n\n' in selenium.page_source)

    def test_1_add_academic_resource(self):
        """
        Tests adding an academic resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        academic_url = "/academic-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[1].click()
        selenium.implicitly_wait(2)

        one = selenium.find_element_by_name('form-0-name')
        one.send_keys('TestResource')
        two = selenium.find_element_by_name('form-0-pdf_file')
        two.send_keys(os.getcwd()+"/administrator/tests/selenium/dummy.pdf")
        three = Select(selenium.find_element_by_name('form-0-resource_type'))
        three.select_by_visible_text('Academic')

        selenium.find_element_by_xpath('//button[text()="Save"]').click()

        # Go check academic resources
        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + academic_url + '"]')[0].click()

        self.assertTrue("TestResource" in selenium.page_source)

    def test_2_add_parental_resource(self):
        """
        Tests adding a parental resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        parental_url = "/parental-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[1].click()
        selenium.implicitly_wait(2)

        one = selenium.find_element_by_name('form-0-name')
        one.send_keys('ParentalTestResource')
        two = selenium.find_element_by_name('form-0-pdf_file')
        two.send_keys(os.getcwd()+"/administrator/tests/selenium/dummy.pdf")
        three = Select(selenium.find_element_by_name('form-0-resource_type'))
        three.select_by_visible_text('Parental')

        selenium.find_element_by_xpath('//button[text()="Save"]').click()

        # Go check academic resources
        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + parental_url + '"]')[0].click()

        self.assertTrue("ParentalTestResource" in selenium.page_source)

    def test_3_deactivate_academic_resource(self):
        """
        Tests adding a parental resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        academic_url = "/academic-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + academic_url + '"]')[0].click()

        # Deactivate Resource
        selenium.find_elements_by_xpath('//button[text()="Deactivate"]')[2].click()
        selenium.implicitly_wait(2)

        # activate Resource
        selenium.find_elements_by_xpath('//button[text()="Activate"]')[0].click()
        selenium.implicitly_wait(2)

    def test_4_deactivate_parental_resource(self):
        """
        Tests adding a parental resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        parental_url = "/parental-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + parental_url + '"]')[0].click()

        # Deactivate Resource
        selenium.find_elements_by_xpath('//button[text()="Deactivate"]')[2].click()
        selenium.implicitly_wait(2)

        # activate Resource
        selenium.find_elements_by_xpath('//button[text()="Activate"]')[0].click()
        selenium.implicitly_wait(2)

    def test_5_remove_academic_resource(self):
        """
        Tests adding a parental resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        academic_url = "/academic-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + academic_url + '"]')[0].click()

        # Remove Resource
        selenium.find_elements_by_xpath('//button[text()="Remove"]')[2].click()
        selenium.implicitly_wait(2)

        self.assertTrue('TestResource' not in selenium.page_source)

    def test_6_remove_parental_resource(self):
        """
        Tests adding a parental resource.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        resources_url = "/resources"
        parental_url = "/parental-resources"
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
        password.send_keys('ualbera123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_elements_by_xpath('//a[@href="' + resources_url + '"]')[0].click()
        selenium.find_elements_by_xpath('//a[@href="' + parental_url + '"]')[0].click()

        # Remove Resource
        selenium.find_elements_by_xpath('//button[text()="Remove"]')[2].click()
        selenium.implicitly_wait(2)

        self.assertTrue("ParentalTestResource" in selenium.page_source)
