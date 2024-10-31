import React from 'react'
import styles from './welcome.module.css'
import Developer from 'src/assets/UI Developer.gif'

const Welcome = ({colorMode}) => {
  return (
    <section className={styles.chatbox} colorMode={colorMode}>
      <div className={styles.welcome_container}>
        <img src={Developer} alt="" style={{borderRadius:'15px'}}/>
        <h3 style={{marginTop: '10%'}}>Please select or create the chat to Start messaging.</h3>
      </div>
    </section>
  )
}

export default Welcome