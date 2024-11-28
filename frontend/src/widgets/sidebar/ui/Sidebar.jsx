import React, {useState, useEffect} from 'react'
import { useKeycloak } from "@react-keycloak/web";

import CreateChatModal from 'src/entities/modals/createChatModal/CreateChatModal';
import UserCard from 'src/entities/userCard/UserCard';

import SidebarChatsContainer from 'src/entities/sidebar/SidebarChatsContainer';
import styles from './styles.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, getChatList, setSelectedChatId } from 'src/app/store/slices/chatSlice';



const Sidebar = () => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const dispatch = useDispatch()

  const colormode = useSelector(selectColorMode)
  
  const [isShowCreateChatModal, setIsShowCreateChatModal] = useState(false)
  const handleCreateChatModalShow = () => setIsShowCreateChatModal(true)
  const handleCreateChatModalClose = () => setIsShowCreateChatModal(false)


  useEffect(() => {
    dispatch(getChatList(username))
  }, [dispatch]) 


  return (
    <aside className={styles.sidemenu} colormode={colormode} o>
      <div className={styles.sidebar_header} onClick={() => dispatch(setSelectedChatId(null))}>
        <img src="/logo.jpeg" alt="" className={styles.logo}/>
        <h5>NeuroDialogue</h5>
      </div>
      <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colormode={colormode}>
          <span>+</span>
          New Chat
      </div>
      <SidebarChatsContainer />
      { keycloak.authenticated && 
        <div>
          <UserCard  colormode={colormode}/>
        </div>
      }
      <CreateChatModal show={isShowCreateChatModal} onHide={handleCreateChatModalClose}/>
    </aside>
  )
}

export default Sidebar