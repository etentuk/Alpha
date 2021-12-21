from .serializers import UserSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView

from bugtracker.models import User


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
