from django.test import TestCase
from administrator.models import *


class RemoveUserViewTest(TestCase):
    """
    This test mimics remove_user_view(request, id) without using any requests.
    """

    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(username='testuser1', password='12345', first_name="one", last_name="test")
        profile = Profile.objects.create(user=user)
        professional1 = Professional.objects.create(profile=profile, creation_time=timezone.now(), picture="picture",
                                                    phone_number=123456, therapy_style1="therapy_style")

        user2 = User.objects.create_user(username='testuser2', password='12345', first_name="two", last_name="test")
        profile2 = Profile.objects.create(user=user2)
        professional2 = Professional.objects.create(profile=profile2, creation_time=timezone.now(), picture="picture",
                                                    phone_number=123456, therapy_style1="therapy_style")

        user3 = User.objects.create_user(username='testuser3', password='12345', first_name="three", last_name="test")
        profile3 = Profile.objects.create(user=user3)
        parent1 = Parent.objects.create(profile=profile3, picture="test", professional=professional1,
                                        health_care_number=123456, phone_number=123456789,
                                        emergency_phone_number=123456789, creation_time=timezone.now())
        Child.objects.create(first_name="three", last_name="test", age=4, picture="test", professional=professional1,
                             parent=parent1, creation_time=timezone.now())

        user4 = User.objects.create_user(username='testuser4', password='12345', first_name="four", last_name="test")
        profile4 = Profile.objects.create(user=user4)
        parent2 = Parent.objects.create(profile=profile4, picture="test", professional=professional2,
                                        health_care_number=123456, phone_number=123456789,
                                        emergency_phone_number=123456789, creation_time=timezone.now())
        Child.objects.create(first_name="child2", last_name="test", age=4, picture="test", professional=professional2,
                             parent=parent2, creation_time=timezone.now())

    def test_remove_child(self):
        """
        Tests removing a child.
        :return:
        """

        ch = Child.objects.get(id=1)
        self.assertTrue(ch.parent)
        self.assertTrue(ch.professional)
        all_ch = list(Child.objects.all())
        self.assertEquals(len(all_ch), 2)
        id = 1
        x = 'c'

        if x == 'c':
            child = Child.objects.filter(id=id).first()
            if child:
                child.delete()
        elif x == 'pa':
            parent = Parent.objects.filter(id=id).first()
            if parent:
                parent.delete()
        else:
            professional = Professional.objects.filter(id=id).first()
            if professional:
                professional.delete()

        ch_list = Child.objects.all()
        self.assertEquals(len(ch_list), 1)

    def test_remove_parent(self):
        all_pa = list(Parent.objects.all())
        self.assertEquals(len(all_pa), 2)
        all_ch = list(Child.objects.all())
        self.assertEquals(len(all_ch), 2)
        id = 1
        x = 'pa'

        if x == 'c':
            child = Child.objects.filter(id=id).first()
            if child:
                child.delete()
        elif x == 'pa':
            parent = Parent.objects.filter(id=id).first()
            if parent:
                parent.delete()
        else:
            professional = Professional.objects.filter(id=id).first()
            if professional:
                professional.delete()

        new_pa = list(Parent.objects.all())
        new_ch = list(Child.objects.all())
        self.assertEquals(len(new_pa), 1)
        self.assertEquals(len(new_ch), 1)

    def test_remove_professional(self):
        all_pa = list(Parent.objects.all())
        self.assertEquals(len(all_pa), 2)
        all_ch = list(Child.objects.all())
        self.assertEquals(len(all_ch), 2)
        all_pr = list(Professional.objects.all())
        self.assertEquals(len(all_pr), 2)
        id = 1
        x = 'pr'

        if x == 'c':
            child = Child.objects.filter(id=id).first()
            if child:
                child.delete()
        elif x == 'pa':
            parent = Parent.objects.filter(id=id).first()
            if parent:
                parent.delete()
        else:
            professional = Professional.objects.filter(id=id).first()
            if professional:
                professional.delete()

        new_pr = list(Professional.objects.all())
        self.assertEquals(len(new_pr), 1)

