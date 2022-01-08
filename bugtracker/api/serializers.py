from django.db import transaction
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from ..models import User, Project, Ticket, Comment
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site


from allauth.account.utils import (filter_users_by_email, user_pk_to_url_str, user_username)
from allauth.utils import build_absolute_uri
from allauth.account.adapter import get_adapter
from allauth.account.forms import default_token_generator
from allauth.account import app_settings


class CustomAllAuthPasswordResetForm(AllAuthPasswordResetForm):

    def clean_email(self):
        """
        Invalid email should not raise error, as this would leak users
        for unit test: test_password_reset_with_invalid_email
        """
        email = self.cleaned_data["email"]
        email = get_adapter().clean_email(email)
        self.users = filter_users_by_email(email, is_active=True)
        return self.cleaned_data["email"]

    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data['email']
        token_generator = kwargs.get('token_generator', default_token_generator)

        for user in self.users:
            temp_key = token_generator.make_token(user)

            path = f"password/reset/confirm/{user_pk_to_url_str(user)}/{temp_key}"
            url = build_absolute_uri(request, path)

            context = {
                "current_site": current_site,
                "user": user,
                "password_reset_url": url,
                "request": request,
                "path": path,
            }

            if app_settings.AUTHENTICATION_METHOD != app_settings.AuthenticationMethod.EMAIL:
                context['username'] = user_username(user)
            get_adapter(request).send_mail(
                'account/email/password_reset_key', email, context
            )

        return self.cleaned_data['email']


class MyPasswordResetSerializer(PasswordResetSerializer):

    def validate_email(self, value):
        # use the custom reset form
        self.reset_form = CustomAllAuthPasswordResetForm(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value


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
        if value in ['ADMIN', 'PROJECT_MANAGER', 'SUBMITTER', 'DEVELOPER']:
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
        fields = ['title', 'description', 'assignee', 'status', 'priority', 'type', 'timestamp', 'creator', 'id',
                  'ticket_history',
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
