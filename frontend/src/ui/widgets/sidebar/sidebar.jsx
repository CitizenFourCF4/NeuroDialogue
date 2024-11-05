import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { getChatsRoute, upgradeChatRoute } from 'src/utils/APIRoutes'
import styles from './sidebar.module.css'
import { BsPencil,BsXLg } from "react-icons/bs";
import RenameChatModal from 'src/ui/components/modals/renameChatModal/RenameChatModal';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { MdLogout, MdBrightnessMedium } from "react-icons/md";
import NewChatModal from 'src/ui/components/modals/newChatModal/NewChatModal';
import { useKeycloak } from "@react-keycloak/web";
import Badge from 'react-bootstrap/Badge';


const Sidebar = ({setSelectedChat, colorMode, setColorMode}) => {

  const { keycloak } = useKeycloak();

  const [selectedChatId, setSelectedChatId] = useState(undefined)
  const [chats, setChats] = useState([])

  const [isShowSettings, setIsShowSettings] = useState(false)
  const [isShowChangeTitleModal, setIsShowChangeTitleModal] = useState(false);
  const [isShowCreateChatModal, setIsShowCreateChatModal] = useState(false)

  const handleChangeTitleModalClose = () => setIsShowChangeTitleModal(false);
  const handleChangeTitleModalShow = () => setIsShowChangeTitleModal(true)

  const handleCreateChatModalShow = () => setIsShowCreateChatModal(true)
  const handleCreateChatModalClose = () => setIsShowCreateChatModal(false)

  useEffect(() => {
    getUserChats()
  }, []) 


  const getUserChats = async() => {

    try{
      const response = await axios.get(getChatsRoute, {
        params:{'username': keycloak.tokenParsed.preferred_username,}
      })
      setChats(response.data.user_chats)
    }
    catch(error){
      console.log(error)
    }
  } 

  
  const changeCurrentChat = (chat_id) => {
      setSelectedChat(chat_id)
      setSelectedChatId(chat_id)
  }

  const chatDeleteHandler = (chat_id) => {
    axios.delete(upgradeChatRoute, {
      data: {
        'chat_id': chat_id 
      } 
    })
    .then(function (response) {
      getUserChats()
        /* TODO: FIX BUG*/
      if(chats.length === 1){ /* На самом деле chats.length === 0 */
        setSelectedChat(undefined)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }

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

  return (
    <aside className={styles.sidemenu} colorMode={colorMode}>
        <img src="/logo.jpeg" alt="" className={styles.logo}/>
        <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colorMode={colorMode}>
            <span>+</span>
            New Chat
        </div>
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
        </div>
        {isShowSettings && 
        <Card id={styles.card} colorMode={colorMode}>
          <ListGroup className="list-group-flush" style={{textAlign: 'left'}}>
            <ListGroup.Item colorMode={colorMode} id={styles.listItem} onClick={colorMode==='dark' ? () => {setColorMode('light'); setIsShowSettings(false)} : () => {setColorMode('dark'); setShowSettings(false)}}><MdBrightnessMedium/> Change color theme</ListGroup.Item>
            <ListGroup.Item colorMode={colorMode} id={styles.listItem} onClick={keycloak.logout}><MdLogout /> Log out</ListGroup.Item>
          </ListGroup>
        </Card>}

        <div className={styles.userInfo} onClick={() => setIsShowSettings(!isShowSettings)} colorMode={colorMode}>
          <div className={styles.avatar}>{keycloak.authenticated && keycloak.tokenParsed.preferred_username[0]}</div>
          <span className={styles.userInfo_username}>{keycloak.authenticated && keycloak.tokenParsed.preferred_username}</span>  
        </div>
        <RenameChatModal show={isShowChangeTitleModal} onHide={handleChangeTitleModalClose} selectedChatId={selectedChatId} getUserChats={getUserChats}/>
        <NewChatModal show={isShowCreateChatModal} getUserChats={getUserChats} onHide={handleCreateChatModalClose}/>

    </aside>
    
  )
}

export default Sidebar