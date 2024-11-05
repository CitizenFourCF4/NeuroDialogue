import React, {useState} from 'react'

import Sidebar from 'src/ui/widgets/sidebar/sidebar'
import Welcome from 'src/ui/widgets/welcome/welcome'
import ChatContainer from 'src/ui/widgets/chatContainer/chatContainer'

import styles from './styles.module.css'

const HomePage = () => {

  const [selectedChatId, setSelectedChatId] = useState(undefined)
  const [colorMode, setColorMode] = useState('dark')

  return (
    <div className={styles.container} colorMode={colorMode}>
      <Sidebar selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} colorMode={colorMode} setColorMode={setColorMode}/>
      {selectedChatId 
        ? <ChatContainer selectedChatId={selectedChatId} colorMode={colorMode}/>
        : <Welcome colorMode={colorMode}/>
      }      
    </div>
  )
}

export default HomePage