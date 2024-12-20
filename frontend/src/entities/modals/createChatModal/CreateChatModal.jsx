import React, { useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import chatModes from 'src/app/settings/chatModes';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ColorCircle from 'src/shared/colorCircle/ColorCircle';
import { HiOutlineChatAlt2 } from "react-icons/hi";

import { useDispatch } from 'react-redux';
import { createChat } from 'src/app/store/slices/chatSlice';

import styles from './styles.module.css'


const CreateChatModal = (props) => {

  const dispatch = useDispatch()

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username
  
  const [chatMode, setChatMode] = useState(undefined)
  const [title, setTitle] = useState('New Chat')

  const createChatHandler = () => {
    if (!chatMode) {
      alert("Выберите тип чата")
    }
    else{
      dispatch(createChat({title, username, chatMode}))
      setTitle('New Chat')
      props.onHide()
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      backdrop='static'
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.customModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <HiOutlineChatAlt2 /> Выберите модель чата
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{'display':'flex', justifyContent:'center'}}>
        <div className={styles.chat_creation_wrapper}>
          <input type="text" onChange={e => setTitle(e.target.value)}  placeholder="Название чата ..." className={styles.chat_title_input}/>
          <ul style={{justifyContent: 'center', 'listStyle': 'none'}}>
            {chatModes.map((mode, idx) => (
              <li className={styles.model_header} key={idx} onClick={() => setChatMode(mode.title_)} active={(mode.title_===chatMode) ? 'active': ''}>
                <div className={styles.chat_title}>
                  <ColorCircle color={mode.color} active={(mode.title_===chatMode) ? 'active': ''}/> {mode.title_}
                </div>
                <p className={styles.chat_description}>{mode.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={createChatHandler}>Создать</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateChatModal