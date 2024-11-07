import React, {useState, useEffect, useRef} from 'react'
import { useKeycloak } from "@react-keycloak/web";
import axios from 'axios'
import { getChatRoute, addMessageRoute } from 'src/app/routes/apiRoutes';

import AttachFileModal from 'src/entities/modals/attachFileModal/AttachFileModal';
import { AiOutlinePaperClip } from "react-icons/ai"
import ChatMessages from 'src/entities/chatMessages/ChatMessages';
import TextInputForm from 'src/shared/textInputForm/TextInputForm';
import { useSelector } from 'react-redux';
import { selectChatId, selectColorMode } from 'src/app/store/slices/chatSlice';

import styles from './styles.module.css'

const ChatContainer = () => {

  const [chatMode, setChatMode] = useState('')
  const [messages, setMessages] = useState([])

  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const [isShowAttachFileModal, setIsShowAttachFileModal] = useState(false);
  const handleAttachFileModalClose = () => setIsShowAttachFileModal(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const getChatData = async() => {
    try{
      const response = await axios.get(`${getChatRoute}${selectedChatId}/`)
      setChatMode(response.data.chat_mode)
      setMessages(response.data.messages)
    } 
    catch (error){
      console.log(error)
    }
  }

  const handleFileAttach = (event) => {
    const file = event.target.files[0];
    const filename = file.name
    if (file) {
      if ((chatMode === 'Extract PDF text') && !filename.endsWith(".pdf")) {
        alert('Выберите .pdf файл')
      }
      else if ((chatMode === 'Image to Video') && (!filename.endsWith('.jpeg') || !filename.endsWith('.jpg') || !filename.endsWith('.png'))){
        alert('Выберите [.jpg, .jpeg, .png] файл')
      }
      else{
        setSelectedFile(file)
        setIsShowAttachFileModal(true)
      }
    }
  };

  const handleData = async(sendData) => {
    setMessages([...messages, {
      'message': 'Ожидайте, Ваш запрос был передан модели', 
      'author': 'chatbot'
    }])

    if (sendData.message_type === 'text') {
      const data = {
        'chat_id': selectedChatId, 
        'message': sendData.message, 
        'username': username,
        'message_type': 'text' 
      }
      try{
        const response = await axios.post(addMessageRoute, data)
        getChatData()
      } 
      catch(error){
        console.log(error)
      }
    }
    else { // sendData.message_type === 'file'
      const data = new FormData();
      data.append('chat_id', selectedChatId)
      data.append('message', selectedFile);
      data.append('username', username)
      data.append('message_type', "file");
      try{
        const response = await axios.post(addMessageRoute, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        getChatData()
      } 
      catch(error){
        console.log(error)
      }
    }
  }
  
  const handleClipClick = () => {
    // Открываем диалог выбора файла
    fileInputRef.current.click();
  };

  useEffect(()=> {
    getChatData()
  }, [selectedChatId])

  return (
    <section className={styles.chatbox} colormode={colormode}>
      <div className={styles.chat_messages_holder}>
        <div style={{width: '25%', textAlign:'left'}}>
          <h4 style={{marginBottom:"30px", marginLeft:'20px'}}>
            {chatMode && chatMode}
          </h4>
        </div>
        <ChatMessages messages={messages}/>
      </div>
      <div className={styles.chat_input_holder}>
        {chatMode && chatMode!='Text to speech' && 
        <div>
          <input type="file" name="" id="" ref={fileInputRef} onChange={handleFileAttach} style={{ display: 'none' }} />
          <div className={styles.clip_wrapper}>
            <AiOutlinePaperClip style={{marginRight: '10px', color:'grey'}} size={40} onClick={handleClipClick} /> 
          </div>
        </div>
        }
        <TextInputForm onSendData={handleData} colormode={colormode} />
      </div>
      <AttachFileModal show={isShowAttachFileModal} onHide={handleAttachFileModalClose} selectedFile={selectedFile} onSendData={handleData}/>
    </section>
  )
}

export default ChatContainer