import React, {useState} from 'react'
import { upgradeChatRoute } from 'src/app/routes/apiRoutes';
import styles from './styles.module.css'
import axios from 'axios'
import Badge from 'react-bootstrap/Badge';
import { BsPencil,BsXLg } from "react-icons/bs";
import RenameChatModal from '../modals/renameChatModal/RenameChatModal';

import { useSelector, useDispatch } from 'react-redux'
import { selectChatId, selectColorMode, setSelectedChatId } from 'src/app/store/slices/chatSlice';

const SidebarChatsContainer = ({chatList, getUserChatList}) => {
  const [isShowChangeTitleModal, setIsShowChangeTitleModal] = useState(false);

  const handleChangeTitleModalClose = () => setIsShowChangeTitleModal(false);
  const handleChangeTitleModalShow = () => setIsShowChangeTitleModal(true);

  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)
  const dispatch = useDispatch();

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

  const changeCurrentChatId = (chat_id) => {
    dispatch(setSelectedChatId(chat_id))
  }

  const chatDeleteHandler = (chat_id) => {
    axios.delete(upgradeChatRoute, { data: { 'chat_id': chat_id} })
    .then(function (response) {
      getUserChatList()
      dispatch(setSelectedChatId(undefined))
    })
    .catch(function (error) {
      console.log(error)
    })
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
              <BsXLg onClick={() => chatDeleteHandler(chat.chat_id)}/>
            </div>}       
          </li>
          ))} 
      </ul>
      <RenameChatModal show={isShowChangeTitleModal} onHide={handleChangeTitleModalClose} getUserChatList={getUserChatList}/>
    </div>
  )
}

export default SidebarChatsContainer