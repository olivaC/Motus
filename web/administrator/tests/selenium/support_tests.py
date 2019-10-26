from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException


class SupportTestCase(LiveServerTestCase):
    """
    Test assumes there are 3 support people. Carrol always being first then Carlo. Must update test if changed.
    """

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(SupportTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(SupportTestCase, self).tearDown()

    def test_0_support_page_exists(self):
        """
        Tests a privacy page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://204.209.76.235'
        support_url = "/support"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
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

        support_page_link = selenium.find_element_by_xpath('//a[@href="' + support_url + '"]')
        support_page_link.click()

        self.assertTrue('Motus | Support Team\n\n' in selenium.page_source)

    def test_1_support_team_exists(self):
        motus_url = 'http://204.209.76.235'
        support_url = "/support"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
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

        support_page_link = selenium.find_element_by_xpath('//a[@href="' + support_url + '"]')
        support_page_link.click()

        self.assertTrue(selenium.find_element_by_name('form-1-name').get_attribute("value") == "Carrol Jirakul")
        self.assertTrue(selenium.find_element_by_name('form-1-position').get_attribute("value") == "Developer")
        self.assertTrue(selenium.find_element_by_name('form-1-phone').get_attribute("value") == "123456")
        self.assertTrue(selenium.find_element_by_name('form-1-email').get_attribute("value") == "test@test.com")

        self.assertTrue(selenium.find_element_by_name('form-0-name').get_attribute("value") == "Carlo Oliva")
        self.assertTrue(selenium.find_element_by_name('form-0-position').get_attribute("value") == "Developer")
        self.assertTrue(selenium.find_element_by_name('form-0-phone').get_attribute("value") == "12345678")
        self.assertTrue(selenium.find_element_by_name('form-0-email').get_attribute("value") == "test@test.com")

    def test_2_remove_third_support(self):
        """
        Tests successfully removing a support person.
        :return:
        """
        motus_url = 'http://204.209.76.235'
        support_url = "/support"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        email.send_keys('motus401@gmail.com')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        support_page_link = selenium.find_element_by_xpath('//a[@href="' + support_url + '"]')
        support_page_link.click()

        # Delete formset row 2
        selenium.find_elements_by_class_name("delete-row")[2].click()
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//button[text()="Save"]').click()
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + support_url + '"]').click()

        # Look for 3rd element
        x = ''
        try:
            x = selenium.find_element_by_name('form-2-name')
        except NoSuchElementException:
            assert x == ''

    def test_3_add_third_support(self):
        """
        Tests adding in a third support person after deleting from the previous test.
        :return:
        """
        motus_url = 'http://204.209.76.235'
        support_url = "/support"
        selenium = self.selenium
        # Opening the link we want to test
        selenium.get(motus_url)
        # find the form element
        email = selenium.find_element_by_id('id_email')
        password = selenium.find_element_by_id('id_password')

        submit = selenium.find_element_by_xpath('//button[text()="Log in"]')

        # Fill the form with data
        email.send_keys('motus401@gmail.com')
        password.send_keys('ualberta123')

        # submitting the form
        submit.send_keys(Keys.RETURN)
        selenium.implicitly_wait(2)

        selenium.find_element_by_xpath('//a[@href="' + support_url + '"]').click()

        selenium.find_element_by_class_name("add-row").click()
        selenium.implicitly_wait(2)

        one = selenium.find_element_by_name('form-2-name')
        one.send_keys('Yar Reech')
        two = selenium.find_element_by_name('form-2-position')
        two.send_keys('Tech Support')
        three = selenium.find_element_by_name('form-2-phone')
        three.send_keys('12345')
        four = selenium.find_element_by_name('form-2-email')
        four.send_keys('test@test.com')

        selenium.find_element_by_xpath('//button[text()="Save"]').click()
        selenium.implicitly_wait(5)

        selenium.find_element_by_xpath('//a[@href="' + support_url + '"]').click()

        self.assertTrue(selenium.find_element_by_name('form-2-name').get_attribute("value") == "Yar Reech")
        self.assertTrue(selenium.find_element_by_name('form-2-position').get_attribute("value") == 'Tech Support')
        self.assertTrue(selenium.find_element_by_name('form-2-phone').get_attribute("value") == '12345')
        self.assertTrue(selenium.find_element_by_name('form-2-email').get_attribute("value") == 'test@test.com')
