from django.contrib import admin
from .models import Project, User, Ticket



# Register your models here.
admin.site.register(User)
admin.site.register(Ticket)
admin.site.register(Project)