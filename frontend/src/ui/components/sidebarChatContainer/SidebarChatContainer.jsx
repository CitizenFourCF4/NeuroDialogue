import React, {useState} from 'react'
import styles from './styles.module.css'
import axios from 'axios'
import Badge from 'react-bootstrap/Badge';
import { BsPencil,BsXLg } from "react-icons/bs";
import RenameChatModal from 'src/ui/components/modals/renameChatModal/RenameChatModal';
import { upgradeChatRoute } from 'src/utils/APIRoutes';

const SidebarChatContainer = ({chats, colorMode, selectedChatId, setSelectedChatId, getUserChats}) => {

  const [isShowChangeTitleModal, setIsShowChangeTitleModal] = useState(false);

  const handleChangeTitleModalClose = () => setIsShowChangeTitleModal(false);
  const handleChangeTitleModalShow = () => setIsShowChangeTitleModal(true);

  const renderMode = (chat) => {
    switch (chat.chat_mode) {
      case 'Extract PDF text':
        return <Badge bg="success" style={{marginRight:'6px'}}>PDF2Text</Badge>
      case 'Text to speech':
        return <Badge bg="warning" style={{marginRight:'6px'}}>TTS</Badge>
      default:
        return <div></div>;
    }
  };


  const changeCurrentChat = (chat_id) => {
    console.log('selected_chat_id', chat_id)
    setSelectedChatId(chat_id)
  }

  const chatDeleteHandler = (chat_id) => {
    axios.delete(upgradeChatRoute, { data: {
        'chat_id': chat_id 
      } 
    })
    .then(function (response) {
      getUserChats()
        /* TODO: FIX BUG*/
      if(chats.length === 1){ /* На самом деле chats.length === 0 */
        setSelectedChatId(undefined)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }
  return (
    <div className={styles.chat_list}>
      <ul className={styles.sidebar_ul}>
        {chats && chats.map((chat, index) => (
          <li data-bs-theme="dark" colorMode={colorMode} className={styles.sidebar_li} key={index} onClick={() => changeCurrentChat(chat.chat_id)} active={selectedChatId ===chat.chat_id ? 'active' : ''}>
            <div className={styles.title}>
              {renderMode(chat)}
              {chat.chat_title}
            </div>
            {selectedChatId === chat.chat_id && 
            <div>
              <BsPencil onClick={handleChangeTitleModalShow} style={{'marginRight': '20px'}}/>     
              <BsXLg onClick={() => chatDeleteHandler(chat.chat_id)}/>
            </div>  }       
          </li>
          ))} 
      </ul>
      <RenameChatModal show={isShowChangeTitleModal} onHide={handleChangeTitleModalClose} selectedChatId={selectedChatId} getUserChats={getUserChats}/>
    </div>
    
  )
}

export default SidebarChatContainer