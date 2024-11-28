import React, {useRef, useEffect,} from 'react'
import styles from './styles.module.css'
import { selectMessages } from 'src/app/store/slices/chatSlice';
import { useSelector } from 'react-redux';
import Message from 'src/entities/message/Message';

const ChatMessages = () => {

  const messages = useSelector(selectMessages)

  const chatEndRef = useRef(null);
  useEffect(() => {
    // Прокрутка к последнему сообщению
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  return (
    <div className={styles.chat_messages_wrapper}>
      {messages && messages.map((msg, index) => (
        <Message msg={msg} index={index} key={index}/>
      ))}
      <div ref={chatEndRef}/>
    </div>
  )
}

export default ChatMessages