from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class PrivacyConditionsTestCase(LiveServerTestCase):

    def setUp(self):
        self.selenium = webdriver.Chrome()
        super(PrivacyConditionsTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(PrivacyConditionsTestCase, self).tearDown()

    def test_privacy_page_exists(self):
        """
        Tests a privacy page exists after successfully logging in.
        :return:
        """
        motus_url = 'http://204.209.76.235'
        privacy_url = "/privacy_terms"
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

        privacy_page_link = selenium.find_element_by_xpath('//a[@href="' + privacy_url + '"]')
        privacy_page_link.click()

        self.assertTrue('Motus | Privacy &amp; Terms\n\n' in selenium.page_source)

    def test_change_privacy_text(self):
        motus_url = 'http://204.209.76.235'
        privacy_url = "/privacy_terms"
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

        # Go to the privacy page
        privacy_page_link = selenium.find_element_by_xpath('//a[@href="' + privacy_url + '"]')
        privacy_page_link.click()
        privacy_text = selenium.find_element_by_id('id_privacy')
        privacy_text.clear()

        privacy_text.send_keys('selenium test')
        selenium.find_element_by_id('id_privacy_button').click()
        self.selenium.implicitly_wait(2)

        # Check if new privacy values changed.
        assert selenium.find_element_by_id('id_privacy').get_attribute("value") == 'selenium test'

        # # Revert to old text
        text = ("Lorem ipsum dolor sit amet, his an voluptua volutpat definitiones. Ut pro modus tempor. Vim ei enim",
                "exerci evertitur. Tractatos ullamcorper ne eos. Tempor impedit lobortis et ius, quo nullam diceret",
                "scribentur id.")
        privacy_text = selenium.find_element_by_id('id_privacy')
        privacy_text.clear()
        privacy_text.send_keys(text)
        selenium.find_element_by_id('id_privacy_button').click()
        self.selenium.implicitly_wait(2)

    def test_change_terms_text(self):
        motus_url = 'http://204.209.76.235'
        privacy_url = "/privacy_terms"
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

        # Go to the privacy page
        privacy_page_link = selenium.find_element_by_xpath('//a[@href="' + privacy_url + '"]')
        privacy_page_link.click()
        terms_text = selenium.find_element_by_id('id_terms')
        terms_text.clear()

        terms_text.send_keys('selenium test')
        selenium.find_element_by_id('id_terms_button').click()
        self.selenium.implicitly_wait(2)

        # Check if new privacy values changed.
        assert selenium.find_element_by_id('id_terms').get_attribute("value") == 'selenium test'

        # # Revert to old text
        text = ("Illud saepe prodesset at est, clita eruditi ius te. Fastidii ullamcorper eu sit, aeque insolens an ",
                "mel. Nihil nonumy qualisque ea qui, tota nonumes has ei. Suas referrentur quo te, et discere fierent ",
                "ius. Soluta deseruisse ad has, ei eripuit honestatis cum, has in solum utamur. Ea his alia probatus, ",
                "eu simul ludus vel.")
        terms_text = selenium.find_element_by_id('id_terms')
        terms_text.clear()
        terms_text.send_keys(text)
        selenium.find_element_by_id('id_terms_button').click()
        self.selenium.implicitly_wait(2)
