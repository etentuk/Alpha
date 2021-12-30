from abc import ABC

from django.db import transaction
from rest_framework import serializers

from django.core.exceptions import ObjectDoesNotExist

from ..models import User, Project, Ticket, Comment

from dj_rest_auth.registration.serializers import RegisterSerializer

from dj_rest_auth.serializers import PasswordResetSerializer

from dotenv import dotenv_values


config = dotenv_values('.env')


class MyPasswordResetSerializer(PasswordResetSerializer):
    #
    def save(self):
        request = self.context.get('request')
        request.META['HTTP_HOST'] = config["FRONTEND_HTTP_HOST"]
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': 'example@yourdomain.com',
            'request': request,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)


class CustomRegisterSerializer(RegisterSerializer):

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.role = 'SUBMITTER'
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    user_permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'role', 'username', 'id', 'user_permissions']

    def get_user_permissions(self, obj):

        return obj.get_all_permissions()

    def update(self, instance, validated_data):
        instance.role = validated_data.get('role', instance.role)

        return instance

    def validate_role(self, value):
        if value in ['ADMIN', 'PROJECT_MANAGER' , 'SUBMITTER', 'DEVELOPER']:
            return value
        raise serializers.ValidationError('Invalid Role Assignment')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'description', 'creator', 'assignees', 'timestamp', 'id']


class TicketSerializer(serializers.ModelSerializer):
    ticket_history = serializers.SerializerMethodField()
    ticket_comments = serializers.SerializerMethodField()


    class Meta:
        model = Ticket
        fields = ['title', 'description', 'assignee', 'status', 'priority', 'type', 'timestamp', 'creator', 'id', 'ticket_history',
                  'project', 'ticket_comments']

    def get_ticket_history(self, obj):
        t_history = obj.history.all()
        delta = []
        for i in range(len(t_history)):
            if i + 1 >= len(t_history):
                break
            delta += [t_history[i].diff_against(t_history[i + 1])]
        all_history = []
        for change in delta:
            for c in change.changes:
                if c.field == 'description' and c.old == "":
                    c.old == 'Blank'
                if c.field == 'assignee':
                    try:
                        c.old = User.objects.get(pk=c.old).username
                    except ObjectDoesNotExist:
                        c.old = "Unassigned"
                    try:
                        c.new = User.objects.get(pk=c.new).username
                    except ObjectDoesNotExist:
                        c.new = 'None'
                if c.field == 'creator':
                    continue

                all_history += [{"change": f"Field '{c.field.capitalize()}' changed from '{c.old}' to '{c.new}'",
                                 "timestamp": change.new_record.updated}]
        return all_history

    def get_ticket_comments(self, obj):
        return CommentSerializer(obj.ticket_comments.all(), many=True).data


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
