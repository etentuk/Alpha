from django.urls import path

from .views import ProjectViewSet, TicketViewSet, UserViewSet, GetLoggedInUserView, UpdateUserRole, CommentViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()


router.register(r'project', ProjectViewSet, basename='project')
router.register(r'ticket', TicketViewSet, basename='ticket')
router.register(r'user', UserViewSet, basename='user')
router.register(r'comment', CommentViewSet, basename='comment')

urlpatterns = [
    path('logged_in_user', GetLoggedInUserView.as_view()),
    path('change_roles', UpdateUserRole.as_view()),
]
urlpatterns += router.urls
