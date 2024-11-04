import React, {useState, useEffect, useRef} from 'react'
import { useKeycloak } from "@react-keycloak/web";

import axios from 'axios'
import { getChatRoute,  addMessageRoute} from 'src/utils/APIRoutes'

import AttachFileModal from 'src/ui/components/modals/attachFileModal/AttachFileModal';
import { AiOutlinePaperClip } from "react-icons/ai"
import ChatMessages from 'src/ui/components/chatMessages/ChatMessages';
import TextInputForm from 'src/ui/components/TextInputForm/TextInputForm';

import styles from './styles.module.css'

const ChatContainer = ({selectedChat, colorMode}) => {

  const [chatMode, setChatMode] = useState('')
  const [messages, setMessages] = useState([])

  const { keycloak } = useKeycloak();

  const [isShowAttachFileModal, setIsShowAttachFileModal] = useState(false);
  const handleAttachFileModalClose = () => setIsShowAttachFileModal(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);


  const handleFileChange = (event) => {
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
        'chat_id': selectedChat, 
        'message': sendData.message, 
        'username': keycloak.tokenParsed.preferred_username,
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
      data.append('chat_id', selectedChat)
      data.append('message', selectedFile);
      data.append('username', keycloak.tokenParsed.preferred_username)
      data.append('message_type', "file");
      try{
        const response = axios.post(addMessageRoute, data, {
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


  const getChatData = async() => {
    try{
      const response = await axios.get(`${getChatRoute}${selectedChat}/`)
      setChatMode(response.data.chat_mode)
      setMessages(response.data.messages)
    } 
    catch (error){
      console.log(error)
    }
  }

  useEffect(()=> {
    getChatData()
  }, [selectedChat])

  return (
    <section className={styles.chatbox} colorMode={colorMode}>
      <div className={styles.chat_messages_holder}>
        <div style={{width: '25%', textAlign:'left'}}>
          <h4 style={{marginBottom:"30px", marginLeft:'20px'}}>
            {chatMode && chatMode}
          </h4>
        </div>
        <ChatMessages messages={messages}/>
      </div>
      <div className={styles.chat_input_holder}>
        <input type="file" name="" id="" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <div className={styles.clip_wrapper}>
          <AiOutlinePaperClip style={{marginRight: '10px', color:'grey'}} size={40} onClick={handleClipClick} /> 
        </div>
        <TextInputForm onSendData={handleData} colorMode={colorMode} />
      </div>
      <AttachFileModal show={isShowAttachFileModal} onHide={handleAttachFileModalClose} selectedFile={selectedFile} onSendData={handleData}/>
    </section>
  )
}

export default ChatContainer