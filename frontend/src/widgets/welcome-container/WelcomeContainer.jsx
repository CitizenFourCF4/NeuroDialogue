import React from 'react'
import styles from './styles.module.css'
import { VscColorMode } from "react-icons/vsc";
import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, setColorMode, createChat } from 'src/app/store/slices/chatSlice'
import { useKeycloak } from '@react-keycloak/web';

import { FaFilePdf, FaFileAudio, FaVideo} from "react-icons/fa";

import 'animate.css';


const WelcomeContainer = () => {
  const colormode = useSelector(selectColorMode)
  const dispatch = useDispatch()

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const createChatHandler = (chatMode) => {
    const title = 'New Chat'
    dispatch(createChat({title, username, chatMode}))
  }
  
  
  return (
    <section className={styles.chatbox} colormode={colormode}>
      <div className={styles.welcome_container}>
        <div className={styles.content_container}>
          <div className={styles.cards}>
            <div className={styles.card} colormode={colormode} onClick={() => createChatHandler('Extract PDF text')}>
              <p>Extract markdown text from PDF file</p>
              <div className={styles.image} colormode={colormode}>
              <FaFilePdf size={20} />
              </div>
            </div>
            <div className={styles.card} colormode={colormode} onClick={() =>createChatHandler('Text to speech')}>
              <p>Convert text message to audio</p>
              <div className={styles.image} colormode={colormode}>
              <FaFileAudio size={20}/>
              </div>
            </div>
            <div className={styles.card} colormode={colormode} onClick={() =>createChatHandler('Image to video')}>
              <p>Convert image to video file</p>
              <div className={styles.image} colormode={colormode}>
              <FaVideo size={20}/>
              </div>
            </div>
          </div>
          <h2 className={styles.header}>To start messaging please select or create <span >AI CHAT.</span> </h2>
        </div>
      </div>        
      <div className={styles.brightness}>
        <VscColorMode 
          size={30} 
          onClick={colormode==='dark' 
            ? () => {dispatch(setColorMode('light'))} 
            : () => {dispatch(setColorMode('dark'))}} 
        />
      </div>
      
    </section>
  )
}

export default WelcomeContainer