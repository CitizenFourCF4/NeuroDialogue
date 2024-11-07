import React, {useState, useEffect} from 'react'
import { useKeycloak } from "@react-keycloak/web";
import axios from 'axios'
import { getChatsRoute } from 'src/app/routes/apiRoutes';

import CreateChatModal from 'src/entities/modals/createChatModal/CreateChatModal';

import Settings from 'src/entities/sidebar/settings/Settings';
import SidebarChatsContainer from 'src/entities/sidebar/SidebarChatsContainer';
import styles from './styles.module.css'

import { useSelector } from 'react-redux'
import { selectChatId, selectColorMode } from 'src/app/store/slices/chatSlice';


const Sidebar = () => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)

  const [chatList, setChatList] = useState([])
  const [isShowSettings, setIsShowSettings] = useState(false)
  
  const [isShowCreateChatModal, setIsShowCreateChatModal] = useState(false)
  const handleCreateChatModalShow = () => setIsShowCreateChatModal(true)
  const handleCreateChatModalClose = () => setIsShowCreateChatModal(false)

  useEffect(() => {
    getUserChatList()
  }, [selectedChatId]) 

  const getUserChatList = async() => {
    try{
      const response = await axios.get(getChatsRoute, {
        params:{'username': username}
      })
      setChatList(response.data.user_chats)      
    }
    catch(error){
      console.log(error)
    }
  } 

  return (
    <aside className={styles.sidemenu} colormode={colormode}>
      <img src="/logo.jpeg" alt="" className={styles.logo}/>
      <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colormode={colormode}>
          <span>+</span>
          New Chat
      </div>
      <SidebarChatsContainer chatList={chatList} getUserChatList={getUserChatList}/>
      {isShowSettings && <Settings setIsShowSettings={setIsShowSettings}/>}
      <div className={styles.userInfo} onClick={() => setIsShowSettings(!isShowSettings)} colormode={colormode}>
        <div className={styles.avatar}>{keycloak.authenticated && username[0]}</div>
        <span className={styles.userInfo_username}>{keycloak.authenticated && username}</span>  
      </div>
      <CreateChatModal show={isShowCreateChatModal} onHide={handleCreateChatModalClose} getUserChatList={getUserChatList}/>
    </aside>
  )
}

export default Sidebar