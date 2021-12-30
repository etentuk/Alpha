from django.contrib import admin
from .models import Project, User, Ticket, Comment


# Register your models here.
admin.site.register(User)
admin.site.register(Ticket)
admin.site.register(Project)
admin.site.register(Comment)
