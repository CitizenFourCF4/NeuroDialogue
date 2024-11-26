import React from 'react'
import { selectColorMode } from 'src/app/store/slices/chatSlice';
import { useSelector } from 'react-redux';
import FileView from 'src/shared/fileView/FileView';
import styles from './styles.module.css'
import AvatarComponent from 'src/shared/avatarComponent/AvatarComponent';


const Message = ({msg, index}) => {

  const colormode = useSelector(selectColorMode)

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
          <audio controls style={{width:'100%'}}>
            <source src={msg.message} type="audio/mpeg" style={{width:'100%'}}/>
          </audio> 
        )
      default:
        return <div>{msg.message}</div>;
    }
  };

  return (
    <div className={styles.message_wrapper} key={index} author={msg.author} colormode={colormode}>
      <AvatarComponent author={msg.author}/>
      <div className={styles.text_wrapper}>
        <div className={styles.author}>{msg.author === 'chatbot' ? 'Bot ' : 'You'}</div>
          <div className={styles.message}>
            {renderMessage(msg)}
          </div>
      </div>  
    </div>
  )
}

export default Message