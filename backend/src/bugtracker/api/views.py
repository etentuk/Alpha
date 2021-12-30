from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, DjangoModelPermissions

from .serializers import UserSerializer, ProjectSerializer, TicketSerializer, CommentSerializer
from ..models import User, Project, Ticket, Comment


class GetLoggedInUserView(APIView):
    def get(self, request):
        user = UserSerializer(request.user)
        return Response(user.data, status=200)


class RoleChangePermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('bugtracker.change_role'):
            return True


class UpdateUserRole(APIView):
    permission_classes = [RoleChangePermission]

    def put(self, request):
        print(request.data)
        users = request.data['users']
        for u in users:
            user = User.objects.get(pk=u)
            serializer = UserSerializer(user, data={'role': request.data['role'], 'username': user.username})
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                user.save()
        serializer = UserSerializer(User.objects.all(), many=True)
        return Response(serializer.data, status=200)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Project.objects.all().order_by('-timestamp')
        elif user.role == 'PROJECT_MANAGER' or 'DEVELOPER' or user.role == 'SUBMITTER':
            tickets = user.assigned_tickets.all()
            parent_projects = Project.objects.filter(tickets__in=tickets)
            user_projects = parent_projects | Project.objects.filter(creator=user) | user.assigned_projects.all()
            return user_projects.distinct().order_by('-timestamp')
        else:
            return []

    def create(self, request, *args, **kwargs):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_project = serializer.save()
            new_project.creator = request.user
            new_project.save()

            return Response(ProjectSerializer(new_project).data, status=200)


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]

    serializer_class = TicketSerializer

    def create(self, request, *args, **kwargs):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_ticket = serializer.save()
            new_ticket.creator = request.user
            new_ticket.save()
            ticket = TicketSerializer(new_ticket).data

            return Response(ticket, status=200)

    def get_queryset(self):
        user = self.request.user
        projects = user.assigned_projects.all()
        tickets = Ticket.objects.filter(project__in=projects)

        if user.role == 'ADMIN':
            return Ticket.objects.all().order_by('-timestamp')
        elif user.role == 'PROJECT_MANAGER' or 'DEVELOPER' or user.role == 'SUBMITTER':
            user_tickets = tickets | Ticket.objects.filter(Q(creator=user) | Q(assignee=user))
            return user_tickets.distinct().order_by('-timestamp')
        else:
            return []


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.commenter == request.user or request.user.role == 'ADMIN'


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]


    def get_queryset(self):
        user = self.request.user
        tickets = Ticket.objects.filter(Q(creator=user) | Q(assignee=user))
        return Comment.objects.filter(ticket__in=tickets)

    def create(self, request, *args, **kwargs):
        data = request.data
        data['commenter'] = request.user.id
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_comment = serializer.save()
            new_comment.commenter = request.user
            new_comment.save()

            return Response(CommentSerializer(new_comment).data, status=200)