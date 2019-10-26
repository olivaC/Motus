from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ProfessionalUserTestCase(LiveServerTestCase):
    """
    Test professionals on local environment to avoid moving professionals on the real server.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(ProfessionalUserTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(ProfessionalUserTestCase, self).tearDown()

    def test_0_professional_user_page_exists(self):
        """
        Tests a professional page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        professionals_url = "/professionals"
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

        selenium.find_element_by_xpath('//a[@href="' + users_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + professionals_url + '"]').click()
        selenium.implicitly_wait(2)

        self.assertTrue('Motus | Professionals\n\n' in selenium.page_source)

    def test_1_professionals_exists(self):
        """
        Tests that a professional exists
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        professionals_url = "/professionals"
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

        selenium.find_element_by_xpath('//a[@href="' + users_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + professionals_url + '"]').click()
        selenium.implicitly_wait(2)

        name1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[1]')
        active1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[2]')
        name2 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[1]')
        inactive2 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[2]')
        self.assertTrue(name1.text, ' Carlo Oliva')
        self.assertTrue(active1.text, 'True')
        self.assertTrue(name2.text, ' carrol ji')
        self.assertTrue(inactive2.text, 'False')

    def test_2_deactivate_active_professionals(self):
        # TODO: Finish this test for sprint 3
        pass

    def test_3_remove_professionals(self):
        # TODO: Finish this test for sprint 3
        pass

    def test_4_view_professional_detail(self):
        # TODO: Finish this test for sprint 4
        pass
