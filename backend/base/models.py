"""
This module contains the data models for the application, defining the
structure of the database tables and the relationships between them.
Each model corresponds to a database table and is used to interact
with the database through Django's ORM (Object-Relational Mapping).
"""

from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    title = models.CharField(max_length=1000, default='New Chat')
    user = models.ForeignKey(User, related_name="chat_owner", on_delete=models.CASCADE, default='unauthorized')
    mode = models.CharField(max_length=50, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    href = models.CharField(max_length=100, null=False, default='')

class Pdf2FileMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='unauthorized')
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1000, default='') # файлы хранятся в файловой системе сервера, по API передается их путь
    message_type = models.CharField(max_length=50, default='') # возможны варианты Text, File
    filename = models.CharField(max_length=200, default='')
    filesize = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.message


class Text2Speech(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='unauthorized')
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1000, default='') # файлы хранятся в файловой системе сервера, по API передается их путь
    message_type = models.CharField(max_length=50, default='') # возможны варианты Text, File, Audio


class Image2Video(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='unauthorized')
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1000, default='') # файлы хранятся в файловой системе сервера, по API передается их путь
    message_type = models.CharField(max_length=50, default='') # возможны варианты Text, File

    def __str__(self):
        return self.message