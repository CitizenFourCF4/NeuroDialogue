import React from 'react'
import styles from './styles.module.css'

const NewChatButton = ({handleCreateChatModalShow, colormode}) => {
  return (
    <div className={styles.side_menu_button} onClick={handleCreateChatModalShow} colormode={colormode}>
      <span>+</span>
      New Chat
    </div>
  )
}

export default NewChatButton