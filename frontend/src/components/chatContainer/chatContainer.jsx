import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import styles from './chatContainer.module.css'
import { getChatRoute,  addMessageRoute} from 'src/utils/APIRoutes'
import { AiOutlineSend, AiOutlinePaperClip } from "react-icons/ai"
import { useKeycloak } from "@react-keycloak/web";
import FileView from 'src/shared/fileview/FileView'

import AttachFileModal from 'src/components//modals/attachFile'
import Badge from 'react-bootstrap/Badge';

const ChatContainer = ({selectedChat, colorMode}) => {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const filename = file.name
    if (file) {
      if (!filename.endsWith(".pdf")) {
        alert('Выберите pdf файл')
      }
      else{
        setSelectedFile(file)
        setIsShowAttachFileModal(true)
      }
    }
  };

  const renderMessage = (msg) => {
    switch (msg.message_type) {
      case 'file':
        return (
          <a href={msg.message} className={styles.file_link} target="_blank">
            <FileView filename={msg.filename} filesize={msg.filesize} iconsize={25}/>
          </a>
          )
      case 'audio':
        return ( 
          <audio controls>
            <source src={msg.message} type="audio/mpeg" />
          </audio> 
        )
      default:
        return <div>{msg.message}</div>;
    }
  };
  
  const fileInputRef = useRef(null);
  const handleClipClick = () => {
    // Открываем диалог выбора файла
    fileInputRef.current.click();
  };

  const [isShowAttachFileModal, setIsShowAttachFileModal] = useState(false);
  const handleAttachFileModalClose = () => setIsShowAttachFileModal(false);
  const handleAttachFileModalShow = () => setIsShowAttachFileModal(true)

  const [selectedFile, setSelectedFile] = useState(null);

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [chatMode, setChatMode] = useState('')
  const [chatTitle, setChatTitle] = useState('')

  const { keycloak } = useKeycloak();

  const getChatData = async() => {
    try{
      const response = await axios.get(`${getChatRoute}${selectedChat}/`)
      setChatMode(response.data.chat_mode)
      setMessages(response.data.messages)
      setChatTitle(response.data.chat_title)
    } 
    catch (error){
      console.log(error)
    }
  }

  useEffect(()=> {
    getChatData()
  }, [selectedChat])

  const sendMessageHandler = async(e) => {    
    e.preventDefault()
    setMessages([...messages, {
      'message': inputMessage, 
      'author': keycloak.tokenParsed.preferred_username
    }, {
      'message': 'Ожидайте, Ваш запрос был передан модели', 
      'author': 'chatbot'
    }])

    const data = {
      'chat_id': selectedChat, 
      'message': inputMessage, 
      'username': keycloak.tokenParsed.preferred_username,
      'message_type': 'text' 
    }
    setInputMessage('')
    try{
      const responce = await axios.post(addMessageRoute, data)
      getChatData()
    }
    catch(error){
      console.log(error)
    }
  }
  
    
  return (
    <section className={styles.chatbox} colorMode={colorMode}>
      <div className={styles.chat_messages_holder}>
        <div style={{width: '25%', textAlign:'left'}}>
          <h4 style={{marginBottom:"30px", marginLeft:'20px'}}>
            {chatMode && chatMode}
          </h4>
        </div>
        <div className={styles.chat_messages_wrapper}>
          {messages && messages.map((msg, index) => (
            <div className={styles.message_wrapper} key={index} author={msg.author}>
              <div className={styles.avatar} author={msg.author} />
              <div className={styles.text_wrapper}>
                <div className={styles.author}>{msg.author === 'chatbot' ? msg.author : 'You'}</div>
                  <div className={styles.message}>
                    {renderMessage(msg)}
                  </div>
              </div>  
            </div>
          ))}
        </div>
      </div>

          <form method='POST' onSubmit={sendMessageHandler}>
            <div className={styles.chat_input_holder}>
              <input type="file" name="" id="" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}/>
                <div className={styles.clip_wrapper}>
                  <AiOutlinePaperClip style={{marginRight: '10px', color:'grey'}} size={40} onClick={handleClipClick}/> 
                </div>
              <div className={styles.chat_input_wrapper} colorMode={colorMode}>
                <input placeholder='Type message...' className={styles.chat_input_textarea} disabled={(chatMode==='Text to speech'? false: true)} onChange={e => setInputMessage(e.target.value)} value={inputMessage} colorMode={colorMode}/>
                <button className={styles.chat_input_button}>
                  <AiOutlineSend size={25}/>
                </button>
              </div>
            </div>
          </form>
          <AttachFileModal show={isShowAttachFileModal} selectedFile={selectedFile} onHide={handleAttachFileModalClose} selectedChat={selectedChat} getChatData={getChatData}/>
        </section>
        
  )
}

export default ChatContainer