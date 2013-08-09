from django.core.management.base import BaseCommand
from mapstory.social_signals import daily_user_welcomes

class Command(BaseCommand):

    def handle(self, *args, **opts):
        daily_user_welcomes()
