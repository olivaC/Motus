from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ParentUserTestCase(LiveServerTestCase):
    """
    Test parents on local environment to avoid moving parents on the real server.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(ParentUserTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(ParentUserTestCase, self).tearDown()

    def test_0_parent_user_page_exists(self):
        """
        Tests an add lesson page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        parents_url = "/parents"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        # Change test with superuser account
        email.send_keys('coliva@ualberta.ca')
        password.send_keys('iamsotired')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + users_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + parents_url + '"]').click()
        selenium.implicitly_wait(2)

        self.assertTrue('Motus | Parents\n\n' in selenium.page_source)

    def test_1_parents_exists(self):
        """
        Tests that a parent exists
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        parents_url = "/parents"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        # Change test with superuser account
        email.send_keys('coliva@ualberta.ca')
        password.send_keys('iamsotired')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + users_url + '"]').click()
        selenium.find_element_by_xpath('//a[@href="' + parents_url + '"]').click()
        selenium.implicitly_wait(2)

        name1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[1]')
        active1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[2]')
        name2 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[2]/div[2]/table/tbody/tr/td[1]')
        inactive2 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[2]/div[2]/table/tbody/tr/td[2]')
        self.assertTrue(name1.text, ' fdsa fdsa')
        self.assertTrue(active1.text, 'True')
        self.assertTrue(name2.text, ' carlo ol')
        self.assertTrue(inactive2.text, 'False')

    def test_2_deactivate_active_parents(self):
        # TODO: Finish this test for sprint 4
        pass

    def test_3_remove_parents(self):
        # TODO: Finish this test for sprint 4
        pass

    def test_4_view_parent_detail(self):
        # TODO: Finish this test for sprint 4
        pass
