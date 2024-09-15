from django.contrib import admin
from .models import UserProfile, Role, Profile

admin.site.register(UserProfile)
admin.site.register(Role)
admin.site.register(Profile)