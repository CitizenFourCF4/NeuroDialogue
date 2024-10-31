import React, { useState} from 'react'
import { AiOutlineSend} from "react-icons/ai"
import styles from './styles.module.css'


const TextInputForm = ({onSendData, colorMode}) => {

  const [inputMessage, setInputMessage] = useState('')

  const sendTextMessageHandler = (e) => {
    e.preventDefault()
    onSendData({
      message_type: 'text',
      message: inputMessage,
    })
    setInputMessage('')
  }
  return (
    <form method='POST' onSubmit={sendTextMessageHandler} style={{width:'50%'}}>
      <div className={styles.chat_input_wrapper} colorMode={colorMode}>
        <input placeholder='Type message...' className={styles.chat_input_textarea} onChange={e => setInputMessage(e.target.value)} value={inputMessage} colorMode={colorMode}/>
        <button className={styles.chat_input_button}>
          <AiOutlineSend size={25}/>
        </button>
      </div>
    </form>
  )
}

export default TextInputForm