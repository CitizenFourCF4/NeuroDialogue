import React, { useState} from 'react'
import { AiOutlineSend} from "react-icons/ai"
import styles from './styles.module.css'
import { useDispatch } from 'react-redux'
import { sendTextMessage } from 'src/app/store/slices/chatSlice'


const TextInputForm = ({colormode, username}) => {

  const dispatch = useDispatch()

  const [inputMessage, setInputMessage] = useState('')

  const sendTextMessageHandler = (e) => {
    e.preventDefault()
    const sendData = {
      message: inputMessage,
      username: username
    }
    dispatch(sendTextMessage(sendData))
    setInputMessage('')
  }
  return (
    <form method='POST' onSubmit={sendTextMessageHandler} style={{width:'50%'}}>
      <div className={styles.chat_input_wrapper} colormode={colormode}>
        <input placeholder='Type message...' className={styles.chat_input_textarea} onChange={e => setInputMessage(e.target.value)} value={inputMessage} colormode={colormode}/>
        <button className={styles.chat_input_button}>
          <AiOutlineSend size={25}/>
        </button>
      </div>
    </form>
  )
}

export default TextInputForm