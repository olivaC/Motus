from django import template

register = template.Library()

"""
Taken from https://stackoverflow.com/questions/46477406/how-to-get-the-name-of-a-class-model-in-template-django 
on Oct 18, 2018
"""


@register.filter(name='get_class')
def get_class(value):
    return value.__class__.__name__
