import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { getChatsRoute} from 'src/utils/APIRoutes'
import styles from './sidebar.module.css'
import NewChatModal from 'src/ui/components/modals/newChatModal/NewChatModal';
import { useKeycloak } from "@react-keycloak/web";
import Settings from 'src/ui/components/settings/Settings';
import SidebarChatContainer from 'src/ui/components/sidebarChatContainer/SidebarChatContainer';


const Sidebar = ({selectedChatId, setSelectedChatId, colorMode, setColorMode}) => {

  const { keycloak } = useKeycloak();

  const [chats, setChats] = useState([])

  const [isShowSettings, setIsShowSettings] = useState(false)
  
  const [isShowCreateChatModal, setIsShowCreateChatModal] = useState(false)

  const handleCreateChatModalShow = () => setIsShowCreateChatModal(true)
  const handleCreateChatModalClose = () => setIsShowCreateChatModal(false)

  useEffect(() => {
    getUserChats()
  }, [selectedChatId]) 

  const getUserChats = async() => {
    try{
      const response = await axios.get(getChatsRoute, {
        params:{'username': keycloak.tokenParsed.preferred_username}
      })
      setChats(response.data.user_chats)
    }
    catch(error){
      console.log(error)
    }
  } 

  return (
    <aside className={styles.sidemenu} colorMode={colorMode}>
        <img src="/logo.jpeg" alt="" className={styles.logo}/>
        <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colorMode={colorMode}>
            <span>+</span>
            New Chat
        </div>
        <SidebarChatContainer chats={chats} colorMode={colorMode} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} getUserChats={getUserChats}/>
        {isShowSettings && <Settings colorMode={colorMode} setColorMode={setColorMode} setIsShowSettings={setIsShowSettings}/>}
        <div className={styles.userInfo} onClick={() => setIsShowSettings(!isShowSettings)} colorMode={colorMode}>
          <div className={styles.avatar}>{keycloak.authenticated && keycloak.tokenParsed.preferred_username[0]}</div>
          <span className={styles.userInfo_username}>{keycloak.authenticated && keycloak.tokenParsed.preferred_username}</span>  
        </div>
        <NewChatModal show={isShowCreateChatModal} getUserChats={getUserChats} onHide={handleCreateChatModalClose}/>
    </aside>
  )
}

export default Sidebar