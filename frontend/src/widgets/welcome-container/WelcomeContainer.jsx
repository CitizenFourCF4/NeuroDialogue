import React from 'react'
import styles from './styles.module.css'
import Developer from '/UI Developer.gif'
import { VscColorMode } from "react-icons/vsc";
import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, setColorMode } from 'src/app/store/slices/chatSlice'


const WelcomeContainer = () => {
  const colormode = useSelector(selectColorMode)
  const dispatch = useDispatch()
  
  
  return (
    <section className={styles.chatbox} colormode={colormode}>
      <div className={styles.welcome_container}>
        <img src={Developer} alt="" style={{borderRadius:'10px'}}/>
        <h3 style={{marginTop: '5%'}}>Please select or create the chat to Start messaging.</h3>
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