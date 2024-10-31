from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Chat, Pdf2FileMessage, Text2Speech
from django.core.files.storage import FileSystemStorage

from rest_framework.decorators import api_view
from rest_framework import status

from backend.settings import MEDIA_URL, MEDIA_ROOT
import os

from dotenv import load_dotenv
from model_integration import process_pdf_2_file, process_text_to_speech

load_dotenv()

@api_view(['GET'])
def user_chats_list_view(request):
   username = request.query_params.get('username')
   # если пользователь только зарегистрировался в системе, то возникает случай User.create()
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
   return Response(data)
  

@api_view(['GET'])
def get_chat_info(request, pk):
   chat = Chat.objects.get(id=pk)

   if chat.mode == 'Extract PDF text':
      messages = Pdf2FileMessage.objects.filter(chat=pk)
   # messages = Message.objects.filter(chat=pk)
      output = {
         "chat_title": chat.title,
         "chat_mode": chat.mode,
         "messages": [
            {
            'message': obj.message,
            'author': obj.user.username,
            'message_type': obj.message_type,
            'filename': obj.filename,
            'filesize': obj.filesize,
            'created_at': obj.created_at,
            }
            for obj in messages]
      }

   if chat.mode == 'Text to speech':
      messages = Text2Speech.objects.filter(chat=pk)
      output = {
         "chat_mode": chat.mode,
         "chat_title": chat.title,
         "messages": [
            {
            'message': obj.message,
            'author': obj.user.username,
            'message_type': obj.message_type,
            'filename': obj.filename,
            'filesize': obj.filesize,
            'created_at': obj.created_at,
            }
            for obj in messages]
      }
   return Response(output)
    
  

class ChatEventHandlerView(APIView):
   def post(self, request): # создание чата
      chat_title = request.data['chat_title']
      chat_mode = request.data['chat_mode']
      username = request.data['username']
      user = User.objects.get(username=username)

      new_object = Chat.objects.create(
            title = chat_title,
            mode = chat_mode,
            user = user,
        )
      id = new_object.id
      new_object.href = f'chat/{id}'
      new_object.save()
      return Response(status=status.HTTP_201_CREATED) 
   

   def put(self,request): # изменение названия чата
      chat_instance = Chat.objects.get(id=request.data['chat_id'])
      chat_instance.title = request.data['new_title']
      chat_instance.save()
      return Response({}) 


   def delete(self, request): # удаление чата
      chat = Chat.objects.filter(id=request.data['chat_id'])
      chat.delete()
      return Response(status=status.HTTP_200_OK) 


@api_view(['POST'])
def create_message_view(request):
   
   chat_id = int(request.data['chat_id'])
   username = request.data['username']
   message = request.data['message']
   message_type = request.data['message_type']

   if message_type == 'file':
      fs = FileSystemStorage()
      filename = fs.save(message.name, message)

   chat = Chat.objects.get(id=chat_id)

   if chat.mode == 'Extract PDF text':
      link = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, filename).lstrip('/'))
      Pdf2FileMessage.objects.create(
         chat=chat,
         user=User.objects.get(username=username),
         message=link,
         message_type = 'file',
         filename = filename,
         filesize=message.size
      )

      answer = process_pdf_2_file(os.path.join(MEDIA_ROOT, filename), MEDIA_ROOT)
      print(answer)
      user_chatbot, _ = User.objects.get_or_create(username='chatbot')
      markdown_filename = filename.removesuffix('.pdf') + '.mmd'
      link = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, markdown_filename).lstrip('/'))
      try:
         filesize = os.path.getsize(os.path.join(MEDIA_ROOT, markdown_filename))
      except:
         filesize = 'Unknown'
      Pdf2FileMessage.objects.create(
         chat=chat,
         user = user_chatbot,
         message=link,
         message_type='file',
         filename=markdown_filename,
         filesize=filesize
      )

   elif chat.mode == 'Text to speech': 
      Text2Speech.objects.create(
         chat=chat,
         user=User.objects.get(username=username),
         message=message,
         message_type=message_type
      )
      user_chatbot, _ = User.objects.get_or_create(username='chatbot')
      filename = process_text_to_speech(message, MEDIA_ROOT)
      link = os.path.join(os.getenv('SERVER_URL'),os.path.join(MEDIA_URL, filename).lstrip('/')) 
      try:
         filesize = os.path.getsize(os.path.join(MEDIA_ROOT, filename))
      except:
         filesize = 'Unknown'
      Text2Speech.objects.create(
         chat=chat,
         user=user_chatbot,
         message=link,
         message_type='audio',
         filename=filename,
         filesize=filesize
      )
      

   return Response({})