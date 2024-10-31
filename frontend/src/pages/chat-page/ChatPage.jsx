import React, {useState, useEffect} from 'react'
import styles from './chatPage.module.css'
import Sidebar from 'src/components/sidebar/sidebar'
import Welcome from 'src/components/welcome/welcome'
import ChatContainer from 'src/components/chatContainer/chatContainer'

const HomePage = () => {

  const [selectedChat, setSelectedChat] = useState(undefined)
  const [colorMode, setColorMode] = useState('dark')

  return (
    <div className={styles.container} colorMode={colorMode}>
      <Sidebar setSelectedChat={setSelectedChat} colorMode={colorMode} setColorMode={setColorMode}/>
      {selectedChat 
        ?(
          <ChatContainer selectedChat={selectedChat} colorMode={colorMode}/>
        )
        :(
          <Welcome colorMode={colorMode}/>
        )}      
    </div>
  )
}

export default HomePage