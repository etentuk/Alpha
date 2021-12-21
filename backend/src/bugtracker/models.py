from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db.models.deletion import CASCADE, SET_NULL
from django.contrib.contenttypes.models import ContentType
from django.db.models.fields.related import ForeignKey, ManyToManyField
from simple_history.models import HistoricalRecords
import uuid


class User(AbstractUser):
    ADMIN = 'ADMIN'
    PROJECT_MANAGER = 'PROJECT_MANAGER'
    SUBMITTER = 'SUBMITTER'
    DEVELOPER = 'DEVELOPER'

    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (PROJECT_MANAGER, 'Project Manager'),
        (SUBMITTER, 'Submitter'),
        (DEVELOPER, 'Developer')
    )

    role = models.CharField(max_length=32, choices=ROLE_CHOICES)

    class Meta:
        permissions = [(
            "change_role", "Can Edit the role of a User")]


class Project(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete=SET_NULL,
                                related_name="created_projects", null=True)
    assignees = ManyToManyField(
        User, related_name="assigned_projects", blank=True,)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.name} created by {self.creator.username}"


class Ticket(models.Model):
    NEW = 'New'
    OPEN = 'Open'
    INPROG = 'In Progress'
    REVIEW = 'Review'
    RESOLVED = 'Resolved'
    ADD_INFO = 'Additional Info Required'

    STATUS_CHOICES = (
        (NEW, 'New'),
        (OPEN, 'Open'),
        (INPROG, 'In Progress'),
        (REVIEW, 'Review'),
        (RESOLVED, 'Resolved'),
        (ADD_INFO, 'Additional Info Required')
    )

    BUG = 'Bugs/Errors'
    FEAT = 'Feature Request'
    OTHER = 'Other Comments'
    TRAINING = 'Training/Document Requests'

    TYPE_CHOICES = (
        (BUG, 'Bugs/Errors'),
        (FEAT, 'Feature Request'),
        (OTHER, 'Other Comments'),
        (TRAINING, 'Training/Document Requests')
    )

    LOW = 'Low'
    MID = 'Medium'
    HIGH = 'High'

    PRIORITY_CHOICES = (
        (LOW, 'Low'),
        (MID, 'Medium'),
        (HIGH, 'High')
    )

    uid = models.UUIDField(
        primary_key=False, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    creator = ForeignKey(User, on_delete=SET_NULL,
                         related_name="created_tickets", null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    assignee = ForeignKey(User, on_delete=SET_NULL,
                          related_name='assigned_tickets', null=True, blank=True)
    type = models.CharField(max_length=32, choices=TYPE_CHOICES)
    status = models.CharField(
        max_length=32, default=NEW, choices=STATUS_CHOICES)
    priority = models.CharField(
        max_length=16, default=MID, choices=PRIORITY_CHOICES)
    updated = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()
    project = ForeignKey(Project, related_name="tickets", on_delete=CASCADE)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    commenter = ForeignKey(User, on_delete=CASCADE, related_name="comments")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.message} by {self.creator.username}"
