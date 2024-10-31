from django.urls import path
from .views import get_chat_info, user_chats_list_view, ChatEventHandlerView, create_message_view

urlpatterns = [
    path("user_chats/", user_chats_list_view, name="chats"),
    path("upgrade_chat/", ChatEventHandlerView.as_view(), name="upgrade_chat"),
    path('chat/<str:pk>/', get_chat_info, name='chat'),
    path('add_message/', create_message_view, name='add_message'),
]