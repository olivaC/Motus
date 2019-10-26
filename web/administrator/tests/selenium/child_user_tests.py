from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ChildUserTestCase(LiveServerTestCase):
    """
    Test children on local environment to avoid moving children on the real server.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(ChildUserTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(ChildUserTestCase, self).tearDown()

    def test_0_child_user_page_exists(self):
        """
        Tests children page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        children_url = "/children"
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
        selenium.find_element_by_xpath('//a[@href="' + children_url + '"]').click()
        selenium.implicitly_wait(2)

        self.assertTrue('Motus | Children\n\n' in selenium.page_source)

    def test_1_children_exists(self):
        """
        Tests that children exists
        :return:
        """
        motus_url = 'http://127.0.0.1:8000/'
        users_url = "/users/"
        children_url = "/children"
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
        selenium.find_element_by_xpath('//a[@href="' + children_url + '"]').click()
        selenium.implicitly_wait(2)

        name1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[1]')
        active1 = selenium.find_element_by_xpath(
            '//*[@id="page-wrapper"]/div[2]/div[1]/div[1]/div[2]/table/tbody/tr[1]/td[2]')
        self.assertTrue(name1.text, ' Regina George')
        self.assertTrue(active1.text, 'True')

    def test_2_deactivate_active_children(self):
        # TODO: Finish this test for sprint 4
        pass

    def test_3_view_child_detail(self):
        # TODO: Finish this test for sprint 4
        pass
