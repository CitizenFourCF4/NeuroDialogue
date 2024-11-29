import React from 'react'
import styles from './styles.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, setSelectedChatId, selectChatId, deleteChat } from 'src/app/store/slices/chatSlice'
import { renderMode } from 'src/entities/sidebar/helpers'
import { BsPencil,BsXLg } from "react-icons/bs";
import { useKeycloak } from '@react-keycloak/web'

const SidebarChatItem = ({index, chat, handleChangeTitleModalShow}) => {
  const dispatch = useDispatch()
  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const colormode = useSelector(selectColorMode)
  const changeCurrentChatId = (chat_id) => {
    dispatch(setSelectedChatId(chat_id))
  }
  const selectedChatId = useSelector(selectChatId)
  
  
  return (
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
  )
}

export default SidebarChatItem