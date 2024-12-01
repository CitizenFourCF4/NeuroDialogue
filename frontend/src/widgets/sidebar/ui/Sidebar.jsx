import React, {useState, useEffect} from 'react'
import { useKeycloak } from "@react-keycloak/web";

import CreateChatModal from 'src/entities/modals/createChatModal/CreateChatModal';
import SidebarHeader from 'src/shared/sidebarHeader/SidebarHeader';
import NewChatButton from 'src/shared/newChatButton/NewChatButton';
import UserCard from 'src/entities/userCard/UserCard';

import SidebarChatsContainer from 'src/entities/sidebar/SidebarChatsContainer';
import styles from './styles.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, getChatList } from 'src/app/store/slices/chatSlice';
import Drawer from '@mui/material/Drawer';

import { BsList } from "react-icons/bs";

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

  const [openDrawer, setOpenDrawer] = useState(true)

  return (
    <div >
    {/* {!openDrawer && 
      <div className={styles.slider} >
        <BsList size={25} onClick={() => {setOpenDrawer(true)}}/>
      </div>}
    <Drawer open={openDrawer} onClose={() => { setOpenDrawer(true)}} variant='persistent' PaperProps={{style: {border: 'none'}}}> */}
      <aside className={styles.sidemenu} colormode={colormode}>
        {/* <div className={styles.drawer} >
          <BsList size={25} onClick={() => {setOpenDrawer(false)}}/>
        </div> */}
        
        <SidebarHeader handleCreateChatModalShow={handleCreateChatModalShow} colormode={colormode}/>
        <NewChatButton colormode={colormode} handleCreateChatModalShow={handleCreateChatModalShow}/>
        <SidebarChatsContainer />
        { keycloak.authenticated && 
          <div>
            <UserCard colormode={colormode}/>
          </div>
        }
        <CreateChatModal show={isShowCreateChatModal} onHide={handleCreateChatModalClose}/>
      </aside>
    {/* </Drawer> */}
    </div>
  )
}

export default Sidebar