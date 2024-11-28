import React, {useState} from 'react'
import styles from './styles.module.css'
import Badge from 'react-bootstrap/Badge';
import { BsPencil,BsXLg } from "react-icons/bs";
import RenameChatModal from '../modals/renameChatModal/RenameChatModal';
import { useKeycloak } from '@react-keycloak/web';

import { useSelector, useDispatch } from 'react-redux'
import { selectChatId, selectColorMode, setSelectedChatId, deleteChat, selectChatList } from 'src/app/store/slices/chatSlice';

const SidebarChatsContainer = () => {
  const [isShowChangeTitleModal, setIsShowChangeTitleModal] = useState(false);

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const handleChangeTitleModalClose = () => setIsShowChangeTitleModal(false);
  const handleChangeTitleModalShow = () => setIsShowChangeTitleModal(true);

  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)
  const chatList = useSelector(selectChatList)
  const dispatch = useDispatch();

  const renderMode = (chat) => {
    switch (chat.chat_mode) {
      case 'Extract PDF text':
        return <Badge bg="success" style={{marginRight:'6px'}}>PDF2Text</Badge>
      case 'Text to speech':
        return <Badge bg="orange" style={{marginRight:'6px', background:'orange'}}>TTS</Badge>
      case 'Image to video':
          return <Badge bg="orange" style={{marginRight:'6px', background:'purple'}}>Img2Vid</Badge>
      default:
        return <div></div>;
    }
  };


  const changeCurrentChatId = (chat_id) => {
    dispatch(setSelectedChatId(chat_id))
  }

  return (
    <div className={styles.chat_list}>
      <ul className={styles.sidebar_ul}>
        {chatList && chatList.map((chat, index) => (
          <li data-bs-theme="dark" colormode={colormode} className={styles.sidebar_li} key={index} onClick={() => changeCurrentChatId(chat.chat_id)} active={selectedChatId===chat.chat_id ? 'active' : ''}>
            <div className={styles.title}>
              {renderMode(chat)}
              {chat.chat_title}
            </div>
            {selectedChatId === chat.chat_id && 
            <div>
              <BsPencil onClick={handleChangeTitleModalShow} style={{'marginRight': '20px'}}/>     
              <BsXLg onClick={() => dispatch(deleteChat({chat_id: chat.chat_id, username: username}))}/>
            </div>}       
          </li>
          ))} 
      </ul>
      <RenameChatModal show={isShowChangeTitleModal} onHide={handleChangeTitleModalClose}/>
    </div>
  )
}

export default SidebarChatsContainer