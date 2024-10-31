import React from 'react'

import styles from './styles.module.css'
import FileView from 'src/shared/fileview/FileView';

const ChatMessages = ({messages}) => {

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

  return (
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
  )
}

export default ChatMessages