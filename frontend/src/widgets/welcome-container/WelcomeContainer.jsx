import React from 'react'
import styles from './styles.module.css'
import Developer from '/UI Developer.gif'
import { useSelector } from 'react-redux'
import { selectColorMode } from 'src/app/store/slices/chatSlice'

const WelcomeContainer = () => {
  const colormode = useSelector(selectColorMode)
  return (
    <section className={styles.chatbox} colormode={colormode}>
      <div className={styles.welcome_container}>
        <img src={Developer} alt="" style={{borderRadius:'15px'}}/>
        <h3 style={{marginTop: '10%'}}>Please select or create the chat to Start messaging.</h3>
      </div>
    </section>
  )
}

export default WelcomeContainer