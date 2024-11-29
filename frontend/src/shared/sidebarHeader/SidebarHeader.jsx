import React from 'react'
import styles from './styles.module.css'
import { setSelectedChatId } from 'src/app/store/slices/chatSlice'
import { useDispatch } from 'react-redux'

const SidebarHeader = () => {
  const dispatch = useDispatch()
  return (
    <div className={styles.sidebar_header} onClick={() => dispatch(setSelectedChatId(null))}>
      <img src="/logo.jpeg" alt="" className={styles.logo}/>
      <h5>NeuroDialogue</h5>
    </div>
  )
}

export default SidebarHeader