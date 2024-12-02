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

from backend.logger_config import logger
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
    logger.info(f"A request was received for a list of chats for the user: {username}")
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
      'user_chats': sorted(user_chats_list, key=lambda x: x['chat_id'])[::-1]
    }
    logger.info(f"The list of chats for the {username} has been returned")
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
    logger.info(f"A request was received for information about the chat with the ID: {pk}")
    try:
        chat = Chat.objects.get(id=pk)
    except Chat.DoesNotExist:
        logger.error(f"The chat was not found with an ID: {pk}")
        return Response(status=status.HTTP_404_NOT_FOUND)

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
        logger.error("Unsupported chat mode: {chat.mode}")
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
    output = {
        "chat_title": chat.title,
        "chat_mode": chat.mode,
        "messages": messages,
        "chat_id": chat.id
    }
    logger.info(f"The chat information with the ID {pk} has been successfully returned")
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
        chat_id:int
        new_title:str


    def post(self, request:Request)->Response:
        """Chat creation handler

        Args:
            request (Request): POST request from the client side

        Returns:
            Response: request status code
        """
        logger.info(f"A request was received to create a chat with data: {request.data}")
        try:
            request_data = self.PostRequestValidator.model_validate(request.data)
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            user = User.objects.get(username=request_data.username)
        except User.DoesNotExist:
            logger.error(f"The user {request_data.username} was not found")
            return Response(status=status.HTTP_404_NOT_FOUND)
        new_object = Chat.objects.create(
            title=request_data.chat_title,
            mode=request_data.chat_mode,
            user=user,
        )
        id = new_object.id
        new_object.href = f'chat/{id}'
        new_object.save()

        logger.info(f"The chat was successfully created with an ID: {id}")
        data = {
            'chat_id': id,
            'chat_title': request_data.chat_title,
            'chat_mode': request_data.chat_mode,
            'created_at': new_object.created_at
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def put(self, request:Request)->Response:
        """Chat title changer handler

        Args:
            request (Request): PUT request from the client side

        Returns:
            Response: request status code
        """
        logger.info(f"A request was received to change the header of the data chat: {request.data}")
        try:
            request_data = self.PutRequestValidator.model_validate(request.data)
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            chat_instance = Chat.objects.get(id=request_data.chat_id)
        except Chat.DoesNotExist:
            logger.error(f"The chat {request_data.chat_id} was not found")
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            chat_instance.title = request_data.new_title
            chat_instance.save()
            logger.info(f"The chat title {request_data.chat_id} has been changed to: {request_data.new_title}")
        except Exception as e:
            logger.error(f"Error when saving the chat title: {e}")
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        logger.info("The title has been successfully changed")
        return Response(status=status.HTTP_200_OK)

    def delete(self, request:Request)->Response:
        """Chat delete handler

        Args:
            request (Request): DELETE request from the client side

        Returns:
            Response: request status code
        """
        logger.info(f"Received a request to delete the chat with data: {request.data}")
        try:
            chat_id = request.data['chat_id']
            chat_instance = Chat.objects.filter(id=chat_id)
            if not chat_instance.exists():
                logger.error(f"Chat not found with ID: {chat_id}")
                return Response(status=status.HTTP_404_NOT_FOUND)
            chat_instance.delete()
            logger.info(f"Chat with ID {chat_id} successfully deleted")
        except Exception as e:
            logger.error(f"Error while deleting chat: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        logger.info("Chat successfully deleted")
        return Response(status=status.HTTP_200_OK)



class MessageValidator:
    def __init__(self, chat_id, username, message, message_type) -> None:
        self.chat_id = chat_id
        self.username = username
        self.message = message
        self.message_type = message_type


@api_view(['POST'])
def create_message_view(request:Request)->Response: 
    """Chat message creation handler

    Args:
        request (Request): POST request from the client side

    Returns:
        Response: request status code
    """
    logger.info(f"Received a request to create a message with data: {request.data}")
    try:
        request_data = MessageValidator(
            chat_id=request.data['chat_id'],
            username=request.data['username'],
            message=request.data['message'],
            message_type=request.data['message_type'],
            )
    except Exception as e:
        logger.error(f"Error when saving the chat title: {e}")
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    try:
        user = User.objects.get(username=request_data.username)
    except:
        logger.error(f"User not found: {request_data.username}")
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    user_chatbot, _ = User.objects.get_or_create(username='chatbot')

    try:
        chat = Chat.objects.get(id=request_data.chat_id)
    except:
        logger.error(f"Chat not found with ID: {request_data.chat_id}")
        return Response(status=status.HTTP_404_NOT_FOUND)

    answer_data = {}
    if chat.mode == 'Extract PDF text':
        # file URL
        if request_data.message_type == 'file':
        # save the file in the media/
            fs = FileSystemStorage()
            filename = fs.save(request_data.message.name, request_data.message)
        else:
            logger.error(f"Invalid document type: {request_data.message_type}")
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        url = os.path.join(os.getenv('SERVER_URL'), os.path.join(MEDIA_URL, filename).lstrip('/')) 

        Pdf2FileMessage.objects.create(
            chat=chat,
            user=user,
            message=url,
            message_type=request_data.message_type,
            filename=filename,
            filesize=request_data.message.size
        )

        process_pdf_2_file(os.path.join(MEDIA_ROOT, filename), MEDIA_ROOT)

        markdown_filename = filename.removesuffix('.pdf') + '.mmd'
        # file URL
        markdown_url = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, markdown_filename).lstrip('/')) 
        try:
            filesize = os.path.getsize(os.path.join(MEDIA_ROOT, markdown_filename))
        except Exception as e:
            logger.warning(f"Failed to get file size: {markdown_filename}. Warning: {e}")
            filesize = 'Unknown'
        Pdf2FileMessage.objects.create(
            chat=chat,
            user=user_chatbot,
            message=markdown_url,
            message_type='file',
            filename=markdown_filename,
            filesize=filesize
        )
        answer_data = {
            'user_message': {
                'message': url,
                'author': request_data.username,
                'message_type': 'file',
                'filename': filename,
                'filesize': request_data.message.size,
                'chat_id': request_data.chat_id
            },
            'bot_message': {
                'message': markdown_url,
                'author': 'chatbot',
                'message_type': 'file',
                'filename': markdown_filename,
                'filesize': filesize,
                'chat_id': request_data.chat_id
            }
            
        }

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
        answer_data = {
            'message': link,
            'author': 'chatbot',
            'message_type': 'audio',
            'chat_id': request_data.chat_id
        }
    else:
        logger.error(f"Unsupported chat mode: {chat.mode}")
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
    
    return Response(data=answer_data, status=status.HTTP_200_OK)