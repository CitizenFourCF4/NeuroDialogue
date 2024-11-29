import React, { useState } from 'react'
import styles from './styles.module.css'
import RenameChatModal from '../modals/renameChatModal/RenameChatModal';
import { useSelector } from 'react-redux'
import { selectChatList } from 'src/app/store/slices/chatSlice';
import SidebarChatItem from 'src/shared/sidebarChatItem/SidebarChatItem';

const SidebarChatsContainer = () => {
  const [isShowChangeTitleModal, setIsShowChangeTitleModal] = useState(false);

  const handleChangeTitleModalClose = () => setIsShowChangeTitleModal(false);
  const handleChangeTitleModalShow = () => setIsShowChangeTitleModal(true);

  const chatList = useSelector(selectChatList)

  return (
    <div className={styles.chat_list}>
      <ul className={styles.sidebar_ul}>
        {chatList && chatList.map((chat, index) => (
          <SidebarChatItem index={index} chat={chat} handleChangeTitleModalShow={handleChangeTitleModalShow}/>
          ))} 
      </ul>
      <RenameChatModal show={isShowChangeTitleModal} onHide={handleChangeTitleModalClose}/>
    </div>
  )
}

export default SidebarChatsContainer