import React, { useState } from 'react'
import { selectColorMode } from 'src/app/store/slices/chatSlice';
import { useSelector } from 'react-redux';
import FileView from 'src/shared/fileView/FileView';
import styles from './styles.module.css'
import AvatarComponent from 'src/shared/avatarComponent/AvatarComponent';
import MarkdownContentModal from '../modals/markdownContent/MarkdownContentModal';
import MediaComponent from 'src/shared/mediaComponent/MediaComponent';



const Message = ({msg, index}) => { 

  const renderMessage = (msg) => {
    switch (msg.message_type) {
      case 'file':
        if (msg.message.endsWith(".mmd")){
          return (
            <div onClick={() => handleMarkdownOpen(msg)} className={styles.file_link}>
              <FileView filetype='mmd' filename={msg.filename} filesize={msg.filesize} iconsize={25} />
            </div>
            )
        }
        else if (msg.message.endsWith(".jpeg") || msg.message.endsWith('.jpg') || msg.message.endsWith('.png') || msg.message.endsWith('.gif')) {
          return(
            <img src={msg.message} style={{width:'300px', height:'300px'}} />
          )
        }
        else { //.pdf
          return (
            <a href={msg.message} className={styles.file_link} target="_blank">
              <FileView filetype='pdf' filename={msg.filename} filesize={msg.filesize} iconsize={25}/>
            </a>
            )
        }
      case 'audio':
        return ( 
          <MediaComponent audioUrl={msg.message}/>
        )
      default:
        return <div>{msg.message}</div>;
    }
  };

  const colormode = useSelector(selectColorMode)
  const [markdownLink, setMarkdownLink] = useState('')
  const [isShowMarkdownModal, setIsShowMarkdownModal] = useState(false)

  const handleMarkdownOpen = (msg) => {
    setMarkdownLink(msg.message)
    setIsShowMarkdownModal(true)
  }

  return (
    <div className={styles.message_wrapper} key={index} author={msg.author} colormode={colormode}>
      <div className={styles.icon}>
        <AvatarComponent author={msg.author}/>
      </div>
      <div className={styles.message_text}>
        {renderMessage(msg)}
      </div> 
      {markdownLink && 
        <MarkdownContentModal link={markdownLink} show={isShowMarkdownModal} onHide={() => setIsShowMarkdownModal(false)}/>
      }
    </div>
  )
}

export default Message