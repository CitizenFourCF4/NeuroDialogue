"""
This module contains the URL routing configuration for the application.
It maps URL patterns to corresponding views, allowing the application
to respond to HTTP requests with the appropriate view functions or classes.
"""

from django.urls import path
from .views import (
    ChatEventHandlerView,
    create_message_view,
    get_chat_info_view,
    user_chats_list_view
    )

urlpatterns = [
    path('add_message/', create_message_view, name='add_message'),
    path('chat/<str:pk>/', get_chat_info_view, name='chat'),
    path("upgrade_chat/", ChatEventHandlerView.as_view(), name="upgrade_chat"),
    path("user_chats/", user_chats_list_view, name="chats"),
]
