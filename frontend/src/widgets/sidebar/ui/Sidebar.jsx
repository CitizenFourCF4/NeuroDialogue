import React, {useState, useEffect} from 'react'
import { useKeycloak } from "@react-keycloak/web";

import CreateChatModal from 'src/entities/modals/createChatModal/CreateChatModal';

import Settings from 'src/entities/sidebar/settings/Settings';
import SidebarChatsContainer from 'src/entities/sidebar/SidebarChatsContainer';
import styles from './styles.module.css'

import { useSelector } from 'react-redux'
import { selectColorMode, getChatList } from 'src/app/store/slices/chatSlice';

import { useDispatch } from 'react-redux';


const Sidebar = () => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const dispatch = useDispatch()

  const colormode = useSelector(selectColorMode)

  const [isShowSettings, setIsShowSettings] = useState(false)
  
  const [isShowCreateChatModal, setIsShowCreateChatModal] = useState(false)
  const handleCreateChatModalShow = () => setIsShowCreateChatModal(true)
  const handleCreateChatModalClose = () => setIsShowCreateChatModal(false)


  useEffect(() => {
    dispatch(getChatList(username))
  }, [dispatch]) 


  return (
    <aside className={styles.sidemenu} colormode={colormode}>
      <img src="/logo.jpeg" alt="" className={styles.logo}/>
      <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colormode={colormode}>
          <span>+</span>
          New Chat
      </div>
      <SidebarChatsContainer />
      {isShowSettings && <Settings setIsShowSettings={setIsShowSettings}/>}
      <div className={styles.userInfo} onClick={() => setIsShowSettings(!isShowSettings)} colormode={colormode}>
        <div className={styles.avatar}>{keycloak.authenticated && username[0]}</div>
        <span className={styles.userInfo_username}>{keycloak.authenticated && username}</span>  
      </div>
      <CreateChatModal show={isShowCreateChatModal} onHide={handleCreateChatModalClose}/>
    </aside>
  )
}

export default Sidebar