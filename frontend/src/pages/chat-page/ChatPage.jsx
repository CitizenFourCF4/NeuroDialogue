import React from 'react'

import Sidebar from 'src/widgets/sidebar/ui/Sidebar'
import ChatContainer from 'src/widgets/chat-container/ChatContainer'
import WelcomeContainer from 'src/widgets/welcome-container/WelcomeContainer'
import { useSelector } from 'react-redux'
import { selectChatId, selectColorMode } from 'src/app/store/slices/chatSlice'

import styles from './styles.module.css'

const ChatPage = () => {
  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)

  return (
    <div className={styles.container} colormode={colormode}>
      <Sidebar />
      {selectedChatId 
        ? <ChatContainer />
        : <WelcomeContainer />
      }      
    </div>
  )
}

export default ChatPage