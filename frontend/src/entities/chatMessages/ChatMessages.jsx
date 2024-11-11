import React, {useRef, useEffect,} from 'react'
import FileView from 'src/shared/fileView/FileView';
import styles from './styles.module.css'

import { FaRobot } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const ChatMessages = ({messages, colormode}) => {

  const chatEndRef = useRef(null);
  useEffect(() => {
    // Прокрутка к последнему сообщению
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
            <source src={msg.message} type="audio/mpeg" style={{width:'100%'}}/>
          </audio> 
        )
      default:
        return <div>{msg.message}</div>;
    }
  };

  return (
    <div className={styles.chat_messages_wrapper}>
      {messages && messages.map((msg, index) => (
        <div className={styles.message_wrapper} key={index} author={msg.author} colormode={colormode}>
          <div className={styles.avatar} author={msg.author}>
            {
            msg.author === 'chatbot'
            ? <FaRobot size={30}/>
            : <FaUser  size={30}/>
          }
          </div>
          <div className={styles.text_wrapper}>
            <div className={styles.author}>{msg.author === 'chatbot' ? 'Bot ' : 'You'}</div>
              <div className={styles.message}>
                {renderMessage(msg)}
              </div>
          </div>  
        </div>
      ))}
      <div ref={chatEndRef}/>
    </div>
  )
}

export default ChatMessages