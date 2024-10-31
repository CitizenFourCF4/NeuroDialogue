"""
This module contains views for processing HTTP requests
in the application. Views define the logic for processing requests and
return appropriate responses.
"""

import os

from dotenv import load_dotenv
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from pydantic import BaseModel
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.settings import MEDIA_URL, MEDIA_ROOT
from model_integration import process_pdf_2_file, process_text_to_speech
from .models import Chat, Pdf2FileMessage, Text2Speech

load_dotenv()

@api_view(['GET'])
def user_chats_list_view(request:Request)->Response:
    """Function for obtaining a list of user chats upon request from the client side

    Args:
        request (Request): GET request from the client side

    Returns:
        Response: List of chats in which the user is a member
    """
    username = request.query_params.get('username')
    # if the user has just registered in the system, then the case User.create() occurs
    user, _ = User.objects.get_or_create(username=username)
    user_chats_list = [
        {
            'chat_id': chat.id,
            'chat_title': chat.title,
            'chat_mode': chat.mode,
            'created_at': chat.created_at,
        }
    for chat in Chat.objects.filter(user=user)]

    data = {
      'user_chats': user_chats_list[::-1]
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_chat_info_view(request:Request, pk:int)->Response:
    """Returns chat information

    Args:
        request (Request): GET request from the client side
        pk (int): chat id

    Returns:
        Response: Returns chat information: 
        - chat_title: str
        - chat_mode: str
        - messages: list
    """
    chat = Chat.objects.get(id=pk)

    if chat.mode == 'Extract PDF text':
        messages = Pdf2FileMessage.objects.filter(chat=pk)
        messages = [
            {
            'message': msg.message,
            'author': msg.user.username,
            'message_type': msg.message_type,
            'filename': msg.filename,
            'filesize': msg.filesize,
            'created_at': msg.created_at,
            }
        for msg in messages]
    elif chat.mode == 'Text to speech':
        messages = Text2Speech.objects.filter(chat=pk)
        messages = [
            {
            'message': msg.message,
            'author': msg.user.username,
            'message_type': msg.message_type,
            'created_at': msg.created_at,
            }
        for msg in messages]
    else:
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
    output = {
        "chat_title": chat.title,
        "chat_mode": chat.mode,
        "messages": messages
    }
    return Response(output, status=status.HTTP_200_OK)



class ChatEventHandlerView(APIView):
    """This class provides event handlers related to chat. 
    It includes a handlers for creating a chat, deleting a chat, and changing the chat title

    Args:
        APIView
    """
    class PostRequestValidator(BaseModel):
        """Post request validator

        Args:
            BaseModel
        """
        chat_title:str
        chat_mode:str
        username:str

    class PutRequestValidator(BaseModel):
        """Put request validator

        Args:
            BaseModel
        """
        chat_id:str
        new_title:str


    def post(self, request:Request)->Response:
        """Chat creation handler

        Args:
            request (Request): POST request from the client side

        Returns:
            Response: request status code
        """
        try:
            request_data = self.PostRequestValidator.model_validate(request.data)
        except:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        user = User.objects.get(username=request_data.username)
        new_object = Chat.objects.create(
            title = request_data.chat_title,
            mode = request_data.chat_mode,
            user = user,
        )
        id = new_object.id
        new_object.href = f'chat/{id}'
        new_object.save()
        return Response(status=status.HTTP_201_CREATED)

    def put(self, request:Request)->Response:
        """Chat title changer handler

        Args:
            request (Request): PUT request from the client side

        Returns:
            Response: request status code
        """
        try:
            request_data = self.PutRequestValidator.model_validate(request.data)
        except:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            chat_instance = Chat.objects.get(id=request_data.chat_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            chat_instance.title = request_data.new_title
            chat_instance.save()
        except:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response(status=status.HTTP_200_OK)

    def delete(self, request:Request)->Response:
        """Chat delete handler

        Args:
            request (Request): DELETE request from the client side

        Returns:
            Response: request status code
        """

        try:
            chat_instance = Chat.objects.filter(id=request.data['chat_id'])
            chat_instance.delete()
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)



class CreateMessageValidator(BaseModel):
    chat_id:int
    username:str
    message:str
    message_type:str


@api_view(['POST'])
def create_message_view(request:Request)->Response:
    """Chat message creation handler

    Args:
        request (Request): POST request from the client side

    Returns:
        Response: _description_
    """
    try:
        request_data = CreateMessageValidator.model_validate(request.data)
    except:
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    try:
        user = User.objects.get(username=request_data.username)
    except:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    user_chatbot, _ = User.objects.get_or_create(username='chatbot')

    try:
        chat = Chat.objects.get(id=request_data.chat_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if chat.mode == 'Extract PDF text':
        # file URL
        if request_data.message_type == 'file':
        # save the file in the media/
            fs = FileSystemStorage()
            filename = fs.save(request_data.message.name, request_data.message)
        else:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        url = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, filename).lstrip('/')) 

        Pdf2FileMessage.objects.create(
            chat=chat,
            user=user,
            message=url,
            message_type=request_data.message_type,
            filename=filename,
            filesize=request_data.message.size
        )

        is_error = process_pdf_2_file(os.path.join(MEDIA_ROOT, filename), MEDIA_ROOT).returncode
        if is_error:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        markdown_filename = filename.removesuffix('.pdf') + '.mmd'
        # file URL
        url = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, markdown_filename).lstrip('/')) 
        try:
            filesize = os.path.getsize(os.path.join(MEDIA_ROOT, markdown_filename))
        except:
            filesize = 'Unknown'
        Pdf2FileMessage.objects.create(
            chat=chat,
            user = user_chatbot,
            message=url,
            message_type='file',
            filename=markdown_filename,
            filesize=filesize
        )

    elif chat.mode == 'Text to speech': 
        Text2Speech.objects.create(
            chat=chat,
            user=user,
            message=request_data.message,
            message_type=request_data.message_type
        )
        filename = process_text_to_speech(request_data.message, MEDIA_ROOT)
        link = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, filename).lstrip('/')) # file URL
        Text2Speech.objects.create(
            chat=chat,
            user=user_chatbot,
            message=link,
            message_type='audio',
        )
    else:
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
    return Response(status=status.HTTP_200_OK)